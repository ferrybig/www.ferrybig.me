import StyleWrapper from './StyleWrapper';
import classes from './PageFooter.module.css';
import Link from './Link';
import { sitemap, period, home } from '../pages';
import License from './License';

export default function PageFooter() {
	return (
		<StyleWrapper as="footer" top="tertiary" bottom="tertiary" className={classes.root}>
			<nav aria-aria-label="Page navigation">
				<ul>
					<li><a href="#top">Scroll to top</a></li>
					<li><Link route={home} props={{ page: '' }}>Home</Link></li>
					<li><Link route={sitemap} props={{}}>Sitemap</Link></li>
					<li><Link route={period} props={{}}>Article calendar</Link></li>
				</ul>
			</nav>
			<div>
				<License/>
			</div>
		</StyleWrapper>
	);
}
