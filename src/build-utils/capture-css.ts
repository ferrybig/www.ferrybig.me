let css: string[] = []
global.window = {} as any;
global.document = {
	createElement: (type: string) => {
		if(type !== 'style') {
			throw new Error(`Unknown type: ${type}`);
		}
		return {
			appendChild(text: string) {
				css.push(text);
			}
		}
	},
	querySelector: () => ({
		appendChild() {}
	}),
	createTextNode: (text: string) => text, 
} as any;

export default css;