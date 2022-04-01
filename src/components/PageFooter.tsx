import StyleWrapper from './StyleWrapper';
import classes from './PageFooter.module.css';
import Link from './Link';
import { sitemap, period, home, allTags } from '../pages';
import License from './License';

export default function PageFooter() {
	return (
		<StyleWrapper as="footer" top="tertiary" bottom="tertiary" className={classes.root}>
			<section className={classes.sectionNavigation}>
				<nav aria-label="Site navigation">
					<p aria-hidden>Site navigation</p>
					<ul>
						<li><a href="#top">Scroll to top</a></li>
						<li><Link route={home} props={{ page: '' }}>Home</Link></li>
						<li><Link route={sitemap} props={{}}>Sitemap</Link></li>
						<li><Link route={period} props={{}}>Article calendar</Link></li>
						<li><Link route={allTags} props={{}}>All tags</Link></li>
					</ul>
				</nav>
			</section>
			<section className={classes.sectionSocial}>
				<nav aria-label="External social media">
					<p aria-hidden>Social media</p>
					<ul>
						<li><a className={classes.socialKeybase} aria-label="Keybase" href="https://keybase.io/ferrybig">ferrybig</a></li>
						<li><a className={classes.socialStackOverflow} aria-label="Stack Overflow" href="https://stackoverflow.com/users/1542723/ferrybig">ferrybig</a></li>
						<li><a className={classes.socialGithub} aria-label="Github" href="https://github.com/ferrybig">ferrybig</a></li>
						<li><a className={classes.socialTwitter} aria-label="Twitter" href="https://twitter.com/ferrybig3">ferrybig3</a></li>
						{/*<li><a className={classes.socialFacebook} href="https://twitter.com/ferrybig3">Twitter @ferrybig3</a></li>*/}
					</ul>
				</nav>
			</section>
			<section className={classes.sectionLicense}>
				<p>License information</p>
				<License/>
			</section>
		</StyleWrapper>
	);
}
