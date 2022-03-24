import route from '../minirouter/route';
import Debug from '../components/Debug';
import Home from './Home';
import Content from './Content';
import Sitemap from './Sitemap';
import SitemapXML from './SitemapXML';

export const home = route`/${'page'}`({ lastOptional: true }).component(Home);
export const homeAtom = route`/atom.xml`().component(Debug);
export const blog = route`/${'slug'}`({ lastOptional: true, tokenDoesMatchSlash: true }).component(Content);
export const tag = route`/${'tag'}/${'page'}`({ lastOptional: true, tokenDoesMatchSlash: false }).component(Debug);
export const tagAtom = route`/${'tag'}/atom.xml`({ lastOptional: true, tokenDoesMatchSlash: false }).component(Debug);
export const period = route`/period/`().component(Debug);
export const byYear = route`/period/${'year'}/${'page'}`({ lastOptional: true }).component(Debug);
export const byMonth = route`/period/${'year'}-${'month'}/${'page'}`({ lastOptional: true }).component(Debug);
export const sitemap = route`/sitemap`().component(Sitemap);
export const sitemapXML = route`/sitemap.xml`().component(SitemapXML);
