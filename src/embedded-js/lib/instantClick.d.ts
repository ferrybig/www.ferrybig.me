declare const defaultExport: {
	init(): void;
	on(event: 'change', listener: () => void): void;
	on(event: 'receive', listener: (url: string, body: HTMLBodyElement, title: string) => void): void;
	// on(event: string, listener: (...args: unknown[]) => void): void;
};
export default defaultExport;
