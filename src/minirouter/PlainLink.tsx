import { HTMLAttributes, ReactNode } from "react";
import { RouteDefinition } from "./route";

export default function PlainLink<R>({ route, props, ...rest }: {
	route: RouteDefinition<any, R>;
	props: R;
} & HTMLAttributes<HTMLAnchorElement>): JSX.Element | null {
	const path = route.toPath(props);
	return (
		<a href={path} {...rest}/>
	);
}

