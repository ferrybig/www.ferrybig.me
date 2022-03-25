import { JSXNode } from '../jsx/jsx-runtime';

interface Props {
	children: JSXNode
}

export default function SrHidden({children}:Props) {
	return (
		<span aria-hidden="true">
			{children}
		</span>
	);
}
