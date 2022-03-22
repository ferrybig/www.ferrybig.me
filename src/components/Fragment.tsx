import { createElement, JSXNode, RAW_TAG_MARKER } from "../jsx/jsx-runtime";

interface Props {
	children: JSXNode;
}

export default function Fragment({
	children,
}: Props): JSX.Element {
	return createElement(RAW_TAG_MARKER, {
		start: '',
		end: '',
	}, children);
}
