import classNames from 'classnames';
import classes from './Column.module.css';
import { ReactNode } from 'react';
interface Column {
	margin?: boolean | undefined,
	padded?: boolean | undefined,
	sticky?: boolean | undefined,
	attached?: 'top' | 'right' | 'left' | 'bottom' | undefined,
	children?: ReactNode,
	className?: string | undefined
	id?: string | undefined
}
function Column({
	margin,
	padded,
	sticky,
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
			[classes.margin]: margin,
			[classes.sticky]: sticky,
		})}>
			{(attached === 'left' || attached === 'right') && <div className={classes.styleHelper}/>}
			{children}
		</div>
	);
}
export default Column;
