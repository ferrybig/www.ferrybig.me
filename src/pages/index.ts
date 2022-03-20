import route from '../minirouter/route';
import Debug from '../components/Debug';
import Home from './Home';
import Blog from './Blog';
import Sitemap from './Sitemap';


export const home = route`/`().component(Home);
export const blog = route`/pages/${'slug'}`().component(Blog);
export const tag = route`/tags/${'tag'}`().component(Debug);
export const sitemap = route`/sitemap`().component(Sitemap);
