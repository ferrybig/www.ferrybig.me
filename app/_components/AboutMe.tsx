import classes from './AboutMe.module.css';
import AboutMeAnimation from './AboutMeAnimation';

export default function AboutMe() {
	return (
		<p className={classes.center}>I&apos;m Fernando, <br/><AboutMeAnimation linkClassName={classes.aboutMeAnimationLink}/></p>
	);
}
