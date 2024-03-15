declare module 'rehype-truncate' {
	export default function rehypeTruncate(options?: Options | null | undefined): (tree: Root) => undefined;
	type Nodes = import('hast').Nodes;
	type Parents = import('hast').Parents;
	type Root = import('hast').Root;
	type Text = import('hast').Text;

	export interface Options {
		maxChars: number,
		ellipses?: string | undefined,
		ignoreTags?: string[] | undefined
		disable?: boolean | undefined
	}
}
