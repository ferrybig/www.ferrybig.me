import { JSXNode } from "../build-utils/jsx-to-html";
import { RouteDefinition } from "../minirouter/route";
import Link from "./Link";

interface LiLinkProps<R> {
	children: JSXNode,
	route: RouteDefinition<any, R>;
	props: R;
	className?: string;
	linkClassName?: string;
}

export default function LiLink<R>({children, route, props, className, linkClassName}: LiLinkProps<R>) {
	return (
		<li className={className}>
			<Link route={route} props={props} className={linkClassName}>
				{children}
			</Link>
		</li>
	)
}
