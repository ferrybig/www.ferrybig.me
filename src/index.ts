import fs from 'fs';
import path from 'path';
import mkdirs from 'mkdirs';
import md5 from 'md5';
import './css';
import js from './embedded-js';
import everyPost, { homePage, perTag } from './content';
import * as routes from './pages';
import PageBase from './PageBase';
import renderElement from './utils/jsx-to-html';
import { RouteDefinition } from './minirouter/route';

function writeFile(file: string, data: string | Buffer) {
	const base = path.dirname(file);
	mkdirs(base);
	console.log(`${`${file}:`.padEnd(40)} ${data.length}\t bytes written`);
	fs.writeFileSync(file, data);
}

function writeWebFile(partialBase: PageBase, file: string, data: string | Buffer, version: boolean) {
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
	partialBase: PageBase,
	route: RouteDefinition<P, I>,
	props: Omit<P, 'base'> & I): [string, string, JSX.Element | null] {
	const parsedPath = route.toPath(props);
	const site = partialBase.site?.endsWith('/') ? partialBase.site.substring(0, partialBase.site.length - 1) : partialBase.site;
	const publicPath = partialBase.publicPath?.endsWith('/') ? partialBase.publicPath.substring(0, partialBase.publicPath.length - 1) : partialBase.publicPath;

	const base: PageBase = {
		...partialBase,
		link: {
			...partialBase.link,
			canonical: site ? `${site}${publicPath}${parsedPath}` : null,
		},
		meta: {
			...partialBase.meta,
			'og:url': site ? `${site}${publicPath}${parsedPath}` : null,
		}
	};
	const file =
		parsedPath.endsWith('.xml') ? `${parsedPath}` :
		parsedPath.endsWith('.atom') ? `${parsedPath}` :
		parsedPath.endsWith('/') ? `${parsedPath}index.html` :
		`${parsedPath}.html`;
	const renderFunction = route.tryRender(parsedPath);
	if (!renderFunction) {
		throw new Error(`Attempting to render ${route}, we got a problem when we parsed ${parsedPath} to a route constructor`);
	}
	return [file, parsedPath, renderFunction({ base, ...props} as unknown as P) ?? null];
}

export default function render(assets: Record<string, string>) {
	console.log('Rendering...');
	const allRenderers: {
		[K in keyof typeof routes]: ((partialBase: PageBase) => [string, string, JSX.Element | null])[];
	} = {
		blog: everyPost.map(content => base => renderRoute(base, routes.blog, { content, slug: content.slug})),
		home: homePage.map((slice, page, { length: pages }) => base => renderRoute(base, routes.home, {slice, page: page === 0 ? '' : page + 1, pages})),
		homeAtom: [base => renderRoute(base, routes.homeAtom, {
			slice: homePage[0],
			title: 'All blog posts',
			linkMain: routes.home.toPath({ page: '' }),
			linkSelf: routes.homeAtom.toPath({}),
		})],
		tag: perTag.flatMap(({tag, content, tagContent}) => content.map(
			(slice, page, { length: pages }) => base => renderRoute(base, routes.tag, {slice, page: page === 0 ? '' : page + 1, pages, tag, tagContent})
		)),
		tagAtom: perTag.map(({tag, content}) => base => renderRoute(base, routes.tagAtom, {
			tag,
			slice: content[0],
			title: 'All content tagged ' + tag,
			linkMain: routes.tag.toPath({ page: '', tag }),
			linkSelf: routes.tagAtom.toPath({ tag }),
		})),
		byYear: [],
		byMonth: [],
		period: [base => renderRoute(base, routes.period, {})],
		sitemap: [base => renderRoute(base, routes.sitemap, {})],
		sitemapXML: [base => renderRoute(base, routes.sitemapXML, {})],
	};
	const applicationBase: PageBase = {
		assets,
		publicPath: '/',
		site: 'https://www.ferrybig.me/',
		urls: [],
		js,
		css: Object.keys(assets).filter(e => e.endsWith('.css')).map(e => `/${e}`),
		link: {},
		meta: {
			author: 'Fernando van Loenhout',
		},
		head: [],
	};
	for (const factory of Object.values(allRenderers).flatMap(a => a)) {
		const [file, loc, jsx] = factory(applicationBase);
		const html = renderElement(jsx);
		writeWebFile(applicationBase, file, html, false);
		applicationBase.urls.push({ loc, file, renderedBy: (jsx?.type instanceof Function ? `<${jsx.type.name}>` : jsx?.type) ?? 'unknown'});
	}
}
