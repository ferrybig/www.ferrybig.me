import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { RouteDefinition } from '../minirouter/route';
import classes from './Link.module.css';

export default function Link<R>({ route, props, className, plain, children, ...rest }: {
	route: RouteDefinition<any, R>;
	props: R;
	plain?: boolean;
} & HTMLAttributes<HTMLAnchorElement>): JSX.Element | null {
	const path = route.toPath(props);
	return (
		<a
			data-instant
			href={path}
			className={classNames(className, {[classes.plain]: plain})}
			{...rest}
		>
			{children}
		</a>
	);
}

