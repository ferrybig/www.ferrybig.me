'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLink {
	href: string,
	children: ReactNode,
	activeClassName: string,
}
function NavLink({href, children, activeClassName}: NavLink) {
	const pathname = usePathname();
	const active = pathname.startsWith(href + '/') || pathname === href;
	return (
		<Link className={active ? activeClassName : undefined} href={href} aria-current={pathname === href}>
			{children}
		</Link>
	);
}
export default NavLink;
