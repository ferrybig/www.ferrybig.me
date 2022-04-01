import { ComponentProps, JSXNode } from '../jsx/jsx-runtime';
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
	topWrapper?: JSXNode,
	bottomWrapper?: JSXNode,
}

export default function PageWrapper({
	children,
	outer = 'secondary',
	inner = 'base',
	bottomOuter = outer,
	bottomInner = inner,
	includeWrapper = false,
	topWrapper,
	bottomWrapper,
	base,
	title,
}: Props) {
	return (
		<RootWrapper base={base} title={(title ? `${title} - ` : '') + 'The website of Fernando van Loenhout'}>
			<div className={classes.scrollWrapper}>
				<TopBar/>
				<main className={classes.flex}>
					<StyleWrapper height="short" top='primary' bottom={outer} bottomInner={inner}>
						{topWrapper}
					</StyleWrapper>
					{includeWrapper ? (
						<StyleWrapper id="main" top={outer} topInner={inner} bottom={bottomOuter} bottomInner={bottomInner} className={classes.main}>
							{children}
						</StyleWrapper>
					) : children}
					<StyleWrapper height="short" top={bottomOuter} topInner={bottomInner} bottom='tertiary'>
						{bottomWrapper}
					</StyleWrapper>
				</main>
				<PageFooter/>
			</div>
		</RootWrapper>
	);
}
