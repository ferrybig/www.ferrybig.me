import fs from 'fs';
import path from 'path';
import mkdirs from 'mkdirs';
import md5 from 'md5';
import SourceMapConcat from 'inline-sourcemap-concat';
import { createElement } from './jsx/jsx-runtime';

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

// Load any pages after this point
import './css'
import * as content from './content';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PageBase from './PageBase';

const translateMap: Partial<Record<string, string>> = {
	className: 'class',
}
const selfClosing: Partial<Record<string, true>> = {
	link: true,
	meta: true,
}

function assertNever(input: never): never {
	throw new Error("Expected never, got: " + JSON.stringify(input));
}

function escape(input: any): string {
	const type = typeof input;
	switch(type) {
		case 'bigint':
		case 'boolean':
		case 'undefined':
		case 'number':
			return `${input}`;
		case 'object':
		case 'symbol':
			return escape(JSON.stringify(input));
		case 'function':
			return escape(`${input}`);
		case 'string':
			return input
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		default:
			assertNever(type);
	}
};


function escapeArgument([key, value]: [string, any]): string {
	if (value === true) return ` ${escape(translateMap[key] ?? key)}`;
	if (value === false) return ``;
	if (value === undefined) return ``;
    return ` ${escape(translateMap[key] ?? key)}="${escape(value)}"`;
};

function renderElement(elm: JSX.Element): string {
	let output: string = '';
	if (elm === null) {
		return '';
	}
	if (typeof elm === 'string' || typeof elm === 'number') {
		return escape(elm);
	}
	if (Array.isArray(elm)) {
		return elm.map(renderElement).join('');
	}
	if (elm.type instanceof Function) {
		return renderElement(elm.type(elm.props))
	}
	if (typeof elm.type !== 'string') {
		throw new Error("Unknown tag type: " + JSON.stringify(elm, (_, e) => typeof e === 'function' ? `${e}`.split('\n')[0] : e));
	}
	const { children = [], dangerouslySetInnerHTML, ...props } = elm.props ?? {};
	output += `<${escape(elm.type)}${Object.entries(props).map(escapeArgument).join('')}>`
	if (!selfClosing[elm.type]) {
		output +=
			dangerouslySetInnerHTML && '__html' in dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html :
			renderElement(children);
		output += `</${escape(elm.type)}>`;
	}
	return output;
}

function writeFile(file: string, data: string | Buffer) {
	const base = path.dirname(file);
	mkdirs(base);
	console.log(`${file}: ${data.length} bytes written`);
	fs.writeFileSync(file, data);
}

function writeWebFile(assets: Record<string, string>, file: string, data: string | Buffer, version: boolean) {
	if (version) {
		const hash = md5(data).substring(0, 20);
		const dot = file.lastIndexOf('.');
		const newName = `${hash}${dot ? file.substring(dot) : ''}`;
		assets[file] = newName;

		writeFile(`dist/${newName}`, data);
	} else {
		assets[file] = file;
		writeFile(`dist/${file}`, data);
	}
}

function renderPage<P>(assets: Record<string, string>, url: string, Component: (props: {base: PageBase}) => JSX.Element): void;
function renderPage<P>(assets: Record<string, string>, url: string, Component: (props: {base: PageBase} & P) => JSX.Element, props: P): void;
function renderPage<P>(assets: Record<string, string>, url: string, Component: (props: {base: PageBase} & P) => JSX.Element, props?: P) {
	const base: PageBase = {
		canonical: `https://www.ferrybig.me/${url.replace(/index\.html$/, '').replace(/\.html$/, '')}`,
		assets,
		publicPath: '/'
	}
	const tree = createElement(Component, {
		base,
		...props
	});
	const html = `<!DOCTYPE html>\n${renderElement(tree)}`;
	writeWebFile(assets, url, html, false);
}

export default function render(assets: Record<string, string>) {
	console.log("Rendering...");

	var sm = SourceMapConcat.create({ mapCommentType: 'block' })
	for (let i = 0; i < css.length; i++) {
		sm.addFileSource(null, css[i]);
	}
	writeWebFile(assets, "bundle.css", sm.generate(), true);
	renderPage(assets, 'index.html', Home);
	renderPage(assets, 'test.html', Blog, { blog: content.blog.myNewWebsite });
}
