import route from '../minirouter/route';
import Home from './Home';
import Content from './Content';
import Sitemap from './Sitemap';
import SitemapXML from './SitemapXML';
import Tag from './Tag';
import AtomFeed from './AtomFeed';
import Period from './Period';
import PeriodItem from './PeriodItem';

export const home = route`/${'page'}`({ lastOptional: true }).component(Home);
export const homeAtom = route`/atom.xml`().component(AtomFeed);
export const blog = route`/${'slug'}`({ lastOptional: true, tokenDoesMatchSlash: true }).component(Content);
export const tag = route`/${'tag'}/${'page'}`({ lastOptional: true }).component(Tag);
export const tagAtom = route`/${'tag'}/atom.xml`({ lastOptional: true }).component(AtomFeed);
export const period = route`/period/`().component(Period);
export const byPeriod = route`/period/${'year'}-${'month'}/${'page'}`({ lastOptional: true }).component(PeriodItem);
export const sitemap = route`/sitemap`().component(Sitemap);
export const sitemapXML = route`/sitemap.xml`().component(SitemapXML);
