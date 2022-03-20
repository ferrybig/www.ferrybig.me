import route from '../minirouter/route';
import Debug from '../components/Debug';
import Home from './Home';
import Content from './Content';
import Sitemap from './Sitemap';


export const home = route`/`().component(Home);
export const blog = route`/pages/${'slug'}`({ tokenDoesMatchSlash: true }).component(Content);
export const tag = route`/tags/${'tag'}`().component(Debug);
export const sitemap = route`/sitemap`().component(Sitemap);
