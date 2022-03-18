declare module 'inline-sourcemap-concat' {
	interface SourceMap {
		generate(): string;
		addFileSource(file: string | null, contents: string): void;
		addSpace(contents: string): void;
	}
	const defaultExport: {
		create(options: {
			mapCommentType?: 'line' | 'block'
		}): SourceMap
	};
	export = defaultExport;
}
