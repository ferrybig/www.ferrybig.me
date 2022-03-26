export const RAW_TAG_MARKER = '!RAW' as const;

export type JSXSimpleNode = JSX.Element | null | boolean | undefined | string | number;
export type JSXNode = JSXSimpleNode | JSXNode[];
export type AnyValidType = keyof JSX.IntrinsicElements | typeof RAW_TAG_MARKER | ((params: any) => JSXNode);
export type ComponentProps<T extends keyof JSX.IntrinsicElements | typeof RAW_TAG_MARKER | ((params: any) => JSXNode)> =
	T extends (params: infer P) => JSXNode ? P :
	T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T]
	: Record<string, unknown>;

export function createElement(type: string | ((props?: any) => JSXNode), props?: any, ...children: any): JSX.Element {
	return {
		type,
		props: {
			children: children ?? undefined,
			...(props ?? {}),
		},
		key: null,
	};
}

export const jsx = createElement;
export const jsxs = createElement;
