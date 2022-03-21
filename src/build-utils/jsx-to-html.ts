import { RAW_TAG_MARKER } from "../jsx/jsx-runtime";
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

export type JSXNode = JSX.Element | null | undefined | string | number | (JSX.Element | null | undefined | string | number)[];

export default function renderElement(
	elm: JSXNode,
	renderStack: string[] = [],
): string {
	if (elm === null || elm === undefined) {
		return '';
	}
	if (typeof elm === 'string' || typeof elm === 'number') {
		return escape(elm);
	}
	if (Array.isArray(elm)) {
		return elm.map(e => renderElement(e, [...renderStack, '[]'])).join('');
	}
	if (elm.type instanceof Function) {
		let newTag;
		try {
			newTag = elm.type(elm.props)
		} catch(err) {
			const e = err instanceof Error ? err : new Error(`${err}`);
			e.message += '\nThis error happened in ' + renderStack;
			throw e;
		}
		return renderElement(newTag, [...renderStack, `${elm.type.name}()`]);
	}
	if (typeof elm.type !== 'string' && elm.type !== RAW_TAG_MARKER) {
		throw new Error("Unknown tag type: " + JSON.stringify({ elm, renderStack}, (_, e) => typeof e === 'function' ? `${e}`.split('\n')[0] : e));
	}
	let output: string = '';
	const { children, dangerouslySetInnerHTML, ...props } = elm.props ?? {};
	output += elm.type === RAW_TAG_MARKER ? elm.props.start : `<${escape(elm.type)}${Object.entries(props).map(escapeArgument).join('')}>`
	if (!selfClosing[elm.type]) {
		output +=
			dangerouslySetInnerHTML && '__html' in dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html :
			children ? renderElement(children) :
			'';
		output += elm.type === RAW_TAG_MARKER ? elm.props.end : `</${escape(elm.type)}>`;
	}
	return output;
}
