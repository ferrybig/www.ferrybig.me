declare module '*&useResponsiveLoader=true' {
	const defaultExport: {
		srcSet: string,
		images: {
			height: number;
			width: number;
			path: string;
		}[],
		src: string,
		placeholder: string,
		toString(): string
	};
	export default defaultExport;
}
