import classNames from 'classnames';
import face from '../images/face.jpg';
import Link from './Link';
import { home } from '../pages';
import classes from './Logo.module.css'

interface Props {
	className: string,
}

export default function Logo({ className }: Props) {
	return (
		<Link route={home} props={{}} className={classNames(className, classes.root)}>
			<img src={face} width={135} height={185}/>
		</Link>
	)
}
