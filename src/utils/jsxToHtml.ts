import { JSXNode, RAW_TAG_MARKER } from '../jsx/jsx-runtime';
import assertNever from './assertNever';
import { selfClosing, escape, escapeArgument } from './htmlUtils';

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
