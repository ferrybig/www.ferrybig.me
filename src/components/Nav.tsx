import { JSXNode } from "../build-utils/jsx-to-html";
import { RouteDefinition } from "../minirouter/route";
import Link from "./Link";
import * as routes from '../pages'

interface NavLinkProps<R> {
	children: JSXNode,
	route: RouteDefinition<any, R>;
	props: R;
}

function NavLink<R>({children, route, props}: NavLinkProps<R>) {
	return (
		<li>
			<Link route={route} props={props}>
				{children}
			</Link>
		</li>
	)
}


export default function Nav() {
	return (
		<nav>
			<ul>
				<NavLink children={"Home"} route={routes.home} props={{}}/>
			</ul>
		</nav>
	);
}