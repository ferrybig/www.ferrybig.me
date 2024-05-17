import { ReactNode } from 'react';
import classes from './Heading.module.css';
import classNames from 'classnames';

interface Heading {
	level: 1 | 2 | 3 | 4 | 5 | 6;
	className?: string;
	id: string;
	title?: string;
	hidden?: boolean;
	children: ReactNode;
}
function Heading({ level, className, id, title, hidden, children }: Heading) {
	const Tag = `h${level}` as keyof JSX.IntrinsicElements;
	return (
		<Tag
			className={classNames(className, id ? classes.withLink : classes.root)}
			id={id}
			title={title}
			hidden={hidden}
		>
			{id && <a href={`#${id}`} aria-hidden tabIndex={-1}></a>}
			{children}
		</Tag>
	);
}
export default Heading;
