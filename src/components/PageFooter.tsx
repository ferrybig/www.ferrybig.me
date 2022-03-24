import StyleWrapper from './StyleWrapper';
import classes from './PageFooter.module.css';
import Link from './Link';
import { sitemap } from '../pages';


export default function PageFooter() {
	return (
		<StyleWrapper as="footer" top="tertiary" bottom="tertiary" className={classes.root}>
			I&apos;m a footer!
			<Link route={sitemap} props={{}}>Sitemap</Link>
			<a href="#top">Scroll to top</a>
		</StyleWrapper>
	);
}
