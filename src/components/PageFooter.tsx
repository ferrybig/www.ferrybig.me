import StyleWrapper from './StyleWrapper';
import classes from './PageFooter.module.css';
import Link from './Link';
import { sitemap, period, home } from '../pages';
import License from './License';
import TagCloud from './TagCloud';
import PageBase from '../PageBase';

interface Props {
	base: PageBase
}

export default function PageFooter({ base }: Props) {
	return (
		<StyleWrapper as="footer" top="tertiary" bottom="tertiary" className={classes.root}>
			<section className={classes.sectionNavigation}>
				<nav aria-label="Page navigation">
					<ul>
						<li><a href="#top">Scroll to top</a></li>
						<li><Link route={home} props={{ page: '' }}>Home</Link></li>
						<li><Link route={sitemap} props={{}}>Sitemap</Link></li>
						<li><Link route={period} props={{}}>Article calendar</Link></li>
					</ul>
				</nav>
			</section>
			<section className={classes.sectionTags}>
				<TagCloud tagCloudHits={base.tagCloudHits}/>
			</section>
			<section className={classes.sectionLicense}>
				<License/>
			</section>
		</StyleWrapper>
	);
}
