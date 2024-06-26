import Link from 'next/link';
import Image from '@/_components/Image';
import ThemeSwitcher from './ThemeSwitcher';
/*
import NavIcon from './NavIcon';
import github from '@assets/github.svg';
import stackOverflow from '@assets/stackOverflow.svg';
import keybase from '@assets/keybase.svg';
*/
import face from '@assets/face.png';
import classes from './Nav.module.css';
import NavLink from './NavLink';
import { getTopicChildren } from '@/content';
import {getAllPosts} from '@/content';

async function Nav() {
	const tags = getTopicChildren();

	return (
		<div className={classes.nav}>
			<Link href="/" className={classes.pictureHolder}>
				<Image src={face} width={128} height={128} alt="" className={classes.picture} loading="eager" />
			</Link>
			<h1 className={classes.title}>Ferrybig&apos;s personal internet space</h1>
			<div className={classes.icons}>
				{/*<NavIcon href="https://stackoverflow.com/users/1542723/ferrybig" small src={stackOverflow} alt="My StackOverflow Account"/>
				<NavIcon href="https://github.com/ferrybig" small src={github} alt="My Github Account"/>
				<NavIcon href="https://keybase.io/ferrybig" small src={keybase} alt="My Keybase Account"/>
	<div className={classes.spacer}/>*/}
				<ThemeSwitcher/>
			</div>
			<nav className={classes.topics}>
				<ul>
					{tags.map(e => (
						<li className={e.topicIndex! >= 0 ? classes.topic : classes.topicLast} key={e.slug}>
							<NavLink
								href={`/${e.slug}`}
								activeClassName={classes.active}
								activePages={getAllPosts().filter(a => a.slug === e.slug || a.tags.includes(e.slug)).map(a => '/' + a.slug).sort()}
							>
								{e.linkTitle}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
export default Nav;
