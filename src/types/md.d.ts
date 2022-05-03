declare module '*.md' {
	const defaultExport: string;
	export default defaultExport;

	export const created: string;
	export const updated: string;
	export const date: string;
	export const endDate: string | undefined;
	export const hidden: boolean | undefined;
	export const slug: string;
	export const repo: string | null;
	export const tags: string[];
	export const extraTags: string[];
}
