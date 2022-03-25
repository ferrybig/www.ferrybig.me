declare module '*.css' {
	interface IClassNames {
		[className: string]: string
	}
	const classes: IClassNames;
	export = classes;
}
