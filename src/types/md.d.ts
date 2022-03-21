declare module '*.md' {
	const defaultExport: string;
	export default defaultExport;
	
	export const date: string
	export const endDate: string
	export const slug: string
	export const tags: string[]
	export const extraTags: string[]
	export const title: string
}
