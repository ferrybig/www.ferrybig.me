import assertNever from "./assert-never";

const translateMap: Partial<Record<string, string>> = {
	className: 'class',
	htmlFor: 'for',
}
const selfClosing: Partial<Record<string, true>> = {
	link: true,
	meta: true,
	br: true,
	img: true,
	input: true,
	base: true,
}



export function escape(input: any): string {
	const type = typeof input;
	switch(type) {
		case 'bigint':
		case 'boolean':
		case 'undefined':
		case 'number':
			return `${input}`;
		case 'object':
		case 'symbol':
			return escape(JSON.stringify(input));
		case 'function':
			return escape(`${input}`);
		case 'string':
			return input
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		default:
			assertNever(type);
	}
};


export function escapeArgument([key, value]: [string, any]): string {
	if (value === true) return ` ${escape(translateMap[key] ?? key)}`;
	if (value === false) return ``;
	if (value === undefined) return ``;
    return ` ${escape(translateMap[key] ?? key)}="${escape(value)}"`;
};

export default function renderElement(elm: JSX.Element | null | undefined | string | number | (JSX.Element | null | undefined | string | number)[]): string {
	let output: string = '';
	if (elm === null || elm === undefined) {
		return '';
	}
	if (typeof elm === 'string' || typeof elm === 'number') {
		return escape(elm);
	}
	if (Array.isArray(elm)) {
		return elm.map(renderElement).join('');
	}
	if (elm.type instanceof Function) {
		return renderElement(elm.type(elm.props))
	}
	if (typeof elm.type !== 'string') {
		throw new Error("Unknown tag type: " + JSON.stringify(elm, (_, e) => typeof e === 'function' ? `${e}`.split('\n')[0] : e));
	}
	const { children, dangerouslySetInnerHTML, ...props } = elm.props ?? {};
	output += `<${escape(elm.type)}${Object.entries(props).map(escapeArgument).join('')}>`
	if (!selfClosing[elm.type]) {
		output +=
			dangerouslySetInnerHTML && '__html' in dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html :
			children ? renderElement(children) :
			'';
		output += `</${escape(elm.type)}>`;
	}
	return output;
}
