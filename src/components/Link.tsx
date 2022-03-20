import { HTMLAttributes, ReactNode } from "react";
import { RouteDefinition } from "../minirouter/route";

export default function Link<R>({ route, props, ...rest }: {
	route: RouteDefinition<any, R>;
	props: R;
} & HTMLAttributes<HTMLAnchorElement>): JSX.Element | null {
	const path = route.toPath(props);
	return (
		<a data-instant href={path} {...rest}/>
	);
}

