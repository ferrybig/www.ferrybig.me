import { ComponentProps, JSXNode } from '../jsx/jsx-runtime';
import StyleWrapper from './StyleWrapper';
import RootWrapper from './RootWrapper';
import TopBar from './TopBar';
import PageFooter from './PageFooter';
import classes from './PageWrapper.module.css';
import PageBase from '../PageBase';

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
	inner = 'base',
	bottomInner = inner,
	base: partialBase,
	title,
}: Props) {
	const base: PageBase = {
		...partialBase,
		meta: {
			'og:site_name': 'The website of Fernando van Loenhout',
			'og:title': title ?? null,
			...partialBase.meta,
		},
	};
	return (
		<RootWrapper base={base} title={(title ? `${title} - ` : '') + 'The website of Fernando van Loenhout'}>
			<div className={classes.scrollWrapper}>
				<TopBar/>
				<main className={classes.flex}>
					<StyleWrapper id="main" top={inner}  bottom={bottomInner} className={classes.main}>
						{children}
					</StyleWrapper>
				</main>
				<PageFooter/>
			</div>
		</RootWrapper>
	);
}
