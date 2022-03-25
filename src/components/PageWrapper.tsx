import { ComponentProps } from '../jsx/jsx-runtime';
import StyleWrapper from './StyleWrapper';
import RootWrapper from './RootWrapper';
import TopBar from './TopBar';
import PageFooter from './PageFooter';
import classes from './PageWrapper.module.css';

interface Props extends ComponentProps<typeof RootWrapper> {
	outer?: 'primary' | 'secondary' | 'tertiary' | 'base',
	inner?: 'primary' | 'secondary' | 'tertiary' | 'base',
	bottomOuter?: 'primary' | 'secondary' | 'tertiary' | 'base',
	bottomInner?: 'primary' | 'secondary' | 'tertiary' | 'base',
	includeWrapper?: boolean,
}

export default function PageWrapper({
	children,
	outer = 'secondary',
	inner = 'base',
	bottomOuter = outer,
	bottomInner = inner,
	includeWrapper = false,
	...rest
}: Props) {
	return (
		<RootWrapper {...rest}>
			<TopBar/>
			<StyleWrapper height="short" top='primary' bottom={outer} bottomInner={inner}/>
			{includeWrapper ? (
				<StyleWrapper as="main" top="secondary" topInner='base' bottom="secondary" bottomInner='base' className={classes.main}>
					{children}
				</StyleWrapper>
			) : (
				<main>
					{children}
				</main>
			)}
			<StyleWrapper height="short" top={bottomOuter} topInner={bottomInner} bottom='tertiary'/>
			<PageFooter/>
		</RootWrapper>
	);
}
