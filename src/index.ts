import fs from 'fs';
import path from 'path';
import mkdirs from 'mkdirs';
import md5 from 'md5';
import SourceMapConcat from 'inline-sourcemap-concat';
import css from './build-utils/capture-css';

// Load any pages after this point
import './css'
import js from './embedded-js';
import content from './content';
import * as routes from './pages';
import PageBase, { PartialBase, SitemapEntry } from './PageBase';
import renderElement from './build-utils/jsx-to-html';
import { RouteDefinition } from './minirouter/route';
import Sitemap from './pages/SitemapXML';

function writeFile(file: string, data: string | Buffer) {
	const base = path.dirname(file);
	mkdirs(base);
	console.log(`${file}: ${data.length} bytes written`);
	fs.writeFileSync(file, data);
}

function writeWebFile(partialBase: PartialBase, file: string, data: string | Buffer, version: boolean) {
	const f = file.startsWith('/') ? file.substring(1) : file;
	if (version) {
		const hash = md5(data).substring(0, 20);
		const dot = f.lastIndexOf('.');
		const newName = `static/${hash}${dot ? f.substring(dot) : ''}`;
		partialBase.assets[f] = newName;

		writeFile(`dist/static/${newName}`, data);
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
		canonical: partialBase.site ? `${partialBase.site}${publicPath}${path}` : null,
		...partialBase,
	}
	const file = path.endsWith('/') ? `${path}index.html` : `${path}.html`;
	return [file, path, route.tryRender(path)?.({ base, ...props} as unknown as P) ?? null];
}

export default function render(assets: Record<string, string>) {
	console.log("Rendering...");

	var sm = SourceMapConcat.create({ mapCommentType: 'block' })
	for (let i = 0; i < css.length; i++) {
		sm.addFileSource(null, css[i]);
	}
	const partialBase: PartialBase = {
		assets,
		publicPath: '/',
		site: 'https://www.ferrybig.me/',
		urls: [],
		js,
	}
	writeWebFile(partialBase, "bundle.css", sm.generate(), true);
	const pages: {
		[K in keyof typeof routes]: ((partialBase: PartialBase) => [string, string, JSX.Element | null])[];
	} = {
		blog: content.map(content => base => renderRoute(base, routes.blog, { content, slug: content.slug})),
		home: [base => renderRoute(base, routes.home, {})],
		tag: [...new Set(content.flatMap(md => [...md.tags, ...md.extraTags])).keys()].map(tag => base => renderRoute(base, routes.tag, { tag })),
		sitemap: [base => renderRoute(base, routes.sitemap, {})],
	}
	for (const factory of Object.values(pages).flatMap(a => a)) {
		const [file, loc, jsx] = factory(partialBase);
		const html = renderElement(jsx);
		writeWebFile(partialBase, file, html, false);
		partialBase.urls.push({ loc, file, renderedBy: (jsx?.type instanceof Function ? `<${jsx.type.name}>` : jsx?.type) ?? 'unknown'});
	}
	
	const html = renderElement(Sitemap({ partialBase }));
	writeWebFile(partialBase, '/sitemap.xml', html, false);
}
