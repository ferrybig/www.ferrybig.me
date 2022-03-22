import { ComponentProps } from '../jsx/jsx-runtime';
import StyleWrapper from './StyleWrapper';
import RootWrapper from "./RootWrapper";
import TopBar from "./TopBar";
import PageFooter from "./PageFooter";
import classes from './PageWrapper.module.css';

interface Props extends ComponentProps<typeof RootWrapper> {
	outer?: 'primary' | 'secondary' | 'tertiary' | 'base',
	inner?: 'primary' | 'secondary' | 'tertiary' | 'base',
}

export default function PageWrapper({
	children,
	outer = 'secondary',
	inner = 'base',
	...rest
}: Props) {
	return (
		<RootWrapper {...rest}>
			<TopBar/>
			<StyleWrapper height="short" top='primary' bottom={outer} bottomInner={inner}/>
			<StyleWrapper as="main" top="secondary" topInner='base' bottom="secondary" bottomInner='base' className={classes.main}>
				{children}
			</StyleWrapper>
			<StyleWrapper height="short" top={outer} topInner={inner} bottom='tertiary'/>
			<PageFooter/>
		</RootWrapper>
	)
}
