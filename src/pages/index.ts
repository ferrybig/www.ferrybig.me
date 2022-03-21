import route from '../minirouter/route';
import Debug from '../components/Debug';
import Home from './Home';
import Content from './Content';
import Sitemap from './Sitemap';
import SitemapXML from './SitemapXML';


export const home = route`/`().component(Home);
export const blog = route`/pages/${'slug'}`({ tokenDoesMatchSlash: true }).component(Content);
export const tag = route`/tags/${'tag'}`().component(Debug);
export const byYear = route`/year/${'year'}`().component(Debug);
export const byMonth = route`/year/${'year'}/${'month'}`().component(Debug);
export const sitemap = route`/sitemap`().component(Sitemap);
export const sitemapXML = route`/sitemap.xml`().component(SitemapXML);
