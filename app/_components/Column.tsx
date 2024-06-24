import classNames from 'clsx';
import classes from './Column.module.css';
import { ReactNode } from 'react';
interface Column {
	margin?: boolean | undefined,
	padded?: boolean | undefined,
	sticky?: boolean | undefined,
	flex?: boolean | undefined,
	attached?: 'top' | 'right' | 'left' | 'bottom' | undefined,
	flatten?: 'top' | 'bottom' | undefined,
	children?: ReactNode,
	className?: string | undefined
	id?: string | undefined
}
function Column({
	margin,
	padded,
	sticky,
	flex,
	flatten,
	attached,
	children,
	className,
	id,
}: Column) {
	return (
		<div id={id} className={classNames(classes.root, className, {
			[classes.padded]: padded,
			[classes.attachedTop]: attached === 'top',
			[classes.attachedLeft]: attached === 'left',
			[classes.attachedRight]: attached === 'right',
			[classes.attachedBottom]: attached === 'bottom',
			[classes.flattenTop]: flatten === 'top',
			[classes.flattenBottom]: flatten === 'bottom',
			[classes.margin]: margin,
			[classes.sticky]: sticky,
			[classes.flex]: flex,
		})}>
			{(attached === 'left' || attached === 'right') && <div className={classes.styleHelper}/>}
			{children}
		</div>
	);
}
export default Column;
