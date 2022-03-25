import { JSXNode } from '../jsx/jsx-runtime';

interface Props {
	children: JSXNode
	className?: string,
}

export default function SrHidden({children, className}:Props) {
	return (
		<span aria-hidden="true" className={className}>
			{children}
		</span>
	);
}
