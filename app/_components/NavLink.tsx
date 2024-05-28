'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLink {
	href: string,
	children: ReactNode,
	activeClassName: string,
	activePages: string[],
}
function NavLink({href, children, activeClassName, activePages}: NavLink) {
	const pathname = usePathname();
	const active = activePages.includes(pathname);
	return (
		<Link className={active ? activeClassName : undefined} href={href} aria-current={pathname === href} prefetch={false}>
			{children}
		</Link>
	);
}
export default NavLink;
