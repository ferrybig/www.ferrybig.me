import fs from 'fs';
import path from 'path';
import mkdirs from 'mkdirs';
import md5 from 'md5';
import './css'
import js from './embedded-js';
import content from './content';
import * as routes from './pages';
import PageBase, { PartialBase } from './PageBase';
import renderElement from './build-utils/jsx-to-html';
import { RouteDefinition } from './minirouter/route';

function writeFile(file: string, data: string | Buffer) {
	const base = path.dirname(file);
	mkdirs(base);
	console.log(`${file}:\t ${data.length}\t bytes written`);
	fs.writeFileSync(file, data);
}

function writeWebFile(partialBase: PartialBase, file: string, data: string | Buffer, version: boolean) {
	const f = file.startsWith('/') ? file.substring(1) : file;
	if (version) {
		const hash = md5(data).substring(0, 20);
		const dot = f.lastIndexOf('.');
		const newName = `static/${hash}${dot ? f.substring(dot) : ''}`;
		partialBase.assets[f] = newName;

		writeFile(`dist/${newName}`, data);
	} else {
		partialBase.assets[f] = f;
		writeFile(`dist/${f}`, data);
	}
}

function renderRoute<P, I>(
	partialBase: PartialBase,
	route: RouteDefinition<P, I>,
	props: Omit<P, 'base'> & I): [string, string, JSX.Element | null] {
	const path = route.toPath(props);
	const site = partialBase.site?.endsWith('/') ? partialBase.site.substring(0, partialBase.site.length - 1) : partialBase.site;
	const publicPath = partialBase.publicPath?.endsWith('/') ? partialBase.publicPath.substring(0, partialBase.publicPath.length - 1) : partialBase.publicPath;

	const base: PageBase = {
		canonical: site ? `${site}${publicPath}${path}` : null,
		...partialBase,
	}
	const file = path.endsWith('.xml') ? `${path}` : path.endsWith('/') ? `${path}index.html` : `${path}.html`;
	return [file, path, route.tryRender(path)?.({ base, ...props} as unknown as P) ?? null];
}

export default function render(assets: Record<string, string>) {
	console.log("Rendering...");

	const partialBase: PartialBase = {
		assets,
		publicPath: '/',
		site: 'https://www.ferrybig.me/',
		urls: [],
		js,
		css: Object.keys(assets).filter(e => e.endsWith('.css')).map(e => `/${e}`),
	}
	const pages: {
		[K in keyof typeof routes]: ((partialBase: PartialBase) => [string, string, JSX.Element | null])[];
	} = {
		blog: content.map(content => base => renderRoute(base, routes.blog, { content, slug: content.slug})),
		home: [base => renderRoute(base, routes.home, {})],
		tag: [...new Set(content.flatMap(md => [...md.tags, ...md.extraTags])).keys()].map(tag => base => renderRoute(base, routes.tag, { tag })),
		byYear: [base => renderRoute(base, routes.byYear, {year: '2020' })],
		byMonth: [base => renderRoute(base, routes.byMonth, { year: '2020', month: '01' })],
		sitemap: [base => renderRoute(base, routes.sitemap, {})],
		sitemapXML: [base => renderRoute(base, routes.sitemapXML, {})],
	}
	for (const factory of Object.values(pages).flatMap(a => a)) {
		const [file, loc, jsx] = factory(partialBase);
		const html = renderElement(jsx);
		writeWebFile(partialBase, file, html, false);
		partialBase.urls.push({ loc, file, renderedBy: (jsx?.type instanceof Function ? `<${jsx.type.name}>` : jsx?.type) ?? 'unknown'});
	}
}
