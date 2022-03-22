import StyleWrapper from './StyleWrapper';
import classes from './PageFooter.module.css';


export default function PageFooter() {
	return (
		<StyleWrapper as="footer" top="tertiary" bottom="tertiary" className={classes.root}>
			I'm a footer!
		</StyleWrapper>
	);
}
