function tryParseHTMLNode(element: HTMLElement): [string, string] | null {
	if (element instanceof HTMLPreElement) {
		if (element.childNodes[0] instanceof HTMLElement) {
			return tryParseHTMLNode(element.childNodes[0]);
		}
		return null;
	} else if (element.tagName === 'CODE') {
		for (const c of element.className.split(/\s+/)) {
			if (c.startsWith('language-')) {
				return [c.substring('language-'.length), element.innerText];
			}
		}
		return null;
	} else {
		return null;
	}
}


class CodePreview extends HTMLElement {
	// #iframe: HTMLIFrameElement;

	constructor() {
		super();

		// this.#iframe = document.createElement('iframe');
		// this.#iframe.src = "about:blank";
		// this.appendChild(this.#iframe);
		const parent = this.parentElement;
		if (!parent) {
			return;
		}
		let ourIndex;
		for (ourIndex = 0; ourIndex < parent.childNodes.length; ourIndex++) {
			if (parent.childNodes[ourIndex] === this) {
				break;
			}
		}
		ourIndex--;
		const codes: Record<string, string> = {};
		for (; ourIndex >= 0; ourIndex--) {
			const element = parent.childNodes[ourIndex];
			if (element instanceof HTMLElement) {
				const result = tryParseHTMLNode(element);
				if (result) {
					codes[result[0]] = result[1];
				} else {
					break;
				}
			}
		}
		console.log({
			weAre: this,
			weDiscovered: codes,
		});
		this.attachShadow({ mode: 'open', });
		const entries = Object.entries(codes);
		if (!entries) {
			const p = document.createElement('p');
			p.style.color = 'red';
			p.innerText = 'Invalid CodePreview component!';
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.shadowRoot!.append(p);
		}
		for (const [type, value] of entries) {
			switch (type) {
			case 'html': {
				const div = document.createElement('div');
				div.innerHTML = value;
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.shadowRoot!.append(div);
				break;
			}
			case 'css': {
				const style = document.createElement('style');
				style.innerText = value;
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.shadowRoot!.append(style);
				break;
			}
			default: {
				const p = document.createElement('p');
				p.style.color = 'red';
				p.innerText = 'Invalid CodePreview module: '+ type;
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.shadowRoot!.append(p);
				break;
			}
			}
		}
	}
}
// <iframe src="about:blank" />
window.customElements.define('code-preview', CodePreview);

export default CodePreview;

