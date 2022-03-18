 export function createElement(type: string | ((props?: any) => JSX.Element), props?: any, children?: any): JSX.Element {
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