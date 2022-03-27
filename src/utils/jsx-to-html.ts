import { JSXNode, RAW_TAG_MARKER } from '../jsx/jsx-runtime';
import assertNever from './assert-never';

const translateMap: Partial<Record<string, string>> = {
	className: 'class',
	htmlFor: 'for',
	dateTime: 'datetime',
};
const selfClosing: Partial<Record<string, true>> = {
	link: true,
	meta: true,
	br: true,
	img: true,
	input: true,
	base: true,
	source: true,
};

export function escape(input: unknown): string {
	switch(typeof input) {
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
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	default:
		throw new Error('Unknown type: ' + typeof input);
	}
}

export function escapeArgument([key, value]: [string, unknown]): string {
	if (value === true) return ` ${escape(translateMap[key] ?? key)}`;
	if (value === false) return '';
	if (value === undefined) return '';
	return ` ${escape(translateMap[key] ?? key)}="${escape(value)}"`;
}

export default function renderElement(
	elm: JSXNode,
	mode: 'html' | 'xml' = 'html',
	renderStack: string[] = [],
): string {
	if (elm === null || elm === undefined || elm === false) {
		return '';
	}
	if (typeof elm === 'string' || typeof elm === 'number') {
		return escape(elm);
	}
	if (elm === true) {
		return 'true';
	}
	if (Array.isArray(elm)) {
		return elm.map(e => renderElement(e, mode, [...renderStack, '[]'])).join('');
	}
	if (elm.type instanceof Function) {
		let newTag;
		try {
			newTag = elm.type(elm.props);
		} catch(err) {
			const e = err instanceof Error ? err : new Error(`${err}`);
			e.message += '\nThis error happened in ' + renderStack;
			throw e;
		}
		return renderElement(newTag, mode, [...renderStack, `${elm.type.name}()`]);
	}
	if (typeof elm.type !== 'string') {
		throw new Error('Unknown tag type: ' + JSON.stringify({ elm, renderStack}, (_, e) => typeof e === 'function' ? `${e}`.split('\n')[0] : e));
	}
	const { children, dangerouslySetInnerHTML, ...props } = elm.props ?? {};
	const newMode = elm.type === RAW_TAG_MARKER ? elm.props.mode ?? mode : mode;
	const childHTML =
		dangerouslySetInnerHTML && '__html' in dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html :
		children ? renderElement(children, newMode, [...renderStack, elm.type]) :
		'';
	if (elm.type === RAW_TAG_MARKER) {
		return elm.props.start + childHTML + elm.props.end;
	} else if (mode === 'html') {
		return `<${escape(elm.type)}${Object.entries(props).map(escapeArgument).join('')}>${childHTML}${!selfClosing[elm.type] ? `</${escape(elm.type)}>` : ''}`;
	} else if (mode === 'xml') {
		return `<${escape(elm.type)}${Object.entries(props).map(escapeArgument).join('')}${childHTML ? `>${childHTML}</${escape(elm.type)}>` : '/>'}`;
	} else {
		return assertNever(mode);
	}
}
