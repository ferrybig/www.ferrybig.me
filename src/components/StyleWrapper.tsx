import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { AnyValidType, createElement, JSXNode } from '../jsx/jsx-runtime';
import classes from './StyleWrapper.module.css';

type Colors = 'primary' | 'secondary' | 'tertiary' | 'base';

const colors: Record<Colors, string> = {
	base: 'Base',
	primary: 'Primary',
	secondary: 'Secondary',
	tertiary: 'Tertiary',
};
const heights = {
	short: classes.heightShort,
	absent: undefined,
};

interface Props extends HTMLAttributes<HTMLElement> {
	top: Colors,
	topInner?: Colors,
	bottom: Colors,
	bottomInner?: Colors,
	as?: AnyValidType,
	children?: JSXNode,
	height?: keyof typeof heights,
}

export default function PageTransition({
	top,
	topInner = top,
	bottom,
	bottomInner = bottom,
	as = 'div',
	children,
	height = 'absent',
	className,
	...rest
}: Props) {
	return createElement(as, {
		className: classNames(
			className,
			classes.root,
			classes[`topOuter${colors[top]}`],
			classes[`topInner${colors[topInner]}`],
			classes[`bottomOuter${colors[bottom]}`],
			classes[`bottomInner${colors[bottomInner]}`],
			heights[height]
		),
		...rest,
	}, createElement('div', {}, children));
}
