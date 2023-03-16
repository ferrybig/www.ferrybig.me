import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { AnyValidType, createElement, JSXNode } from '../jsx/jsx-runtime';
import classes from './StyleWrapper.module.css';

type Colors = 'primary' | 'secondary' | 'tertiary' | 'base' | 'accent';

const colors: Record<Colors, string> = {
	base: 'Base',
	primary: 'Primary',
	secondary: 'Secondary',
	tertiary: 'Tertiary',
	accent: 'Accent',
};
const heights = {
	short: classes.heightShort,
	absent: undefined,
};

interface Props extends HTMLAttributes<HTMLElement> {
	top: Colors,
	bottom: Colors,
	as?: AnyValidType,
	children?: JSXNode,
	height?: keyof typeof heights,
}

export default function PageTransition({
	top,
	bottom,
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
			classes[`topInner${colors[top]}`],
			classes[`bottomInner${colors[bottom]}`],
			heights[height]
		),
		...rest,
	}, createElement('div', {}, children));
}
