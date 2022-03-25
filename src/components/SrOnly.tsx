import { JSXNode } from '../jsx/jsx-runtime';
import globalClasses from '../css/global.module.css';

interface Props {
	children: JSXNode
}

export default function SrOnly({children}:Props) {
	return (
		<span className={globalClasses.visuallyHidden}>
			{children}
		</span>
	);
}
