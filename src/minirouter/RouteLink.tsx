import { ComponentProps } from 'react';
import { RouteDefinition } from './route';
import Link from './Link';

export default function RouteLink<R>({ route, props, ...rest }: {
	route: RouteDefinition<any, R>;
	props: R;
} & Omit<ComponentProps<typeof Link>, 'path'>): JSX.Element | null {
	const path = route.toPath(props);
	return (
		<Link path={path} {...rest}/>
	);
}

