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
	base,
	title,
}: Props) {
	return (
		<RootWrapper base={base} title={title}>
			<div className={classes.scrollWrapper}>
				<TopBar/>
				<StyleWrapper height="short" top='primary' bottom={outer} bottomInner={inner}/>
				{includeWrapper ? (
					<StyleWrapper as="main" top={outer} topInner={inner} bottom={bottomOuter} bottomInner={bottomInner} className={classes.main}>
						{children}
					</StyleWrapper>
				) : (
					<main>
						{children}
					</main>
				)}
				<StyleWrapper height="short" top={bottomOuter} topInner={bottomInner} bottom='tertiary'/>
				<PageFooter base={base}/>
			</div>
		</RootWrapper>
	);
}
