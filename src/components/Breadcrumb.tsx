import classes from './Breadcrumb.module.css';
import {home} from '../pages';

interface Props {
	links: [string, string][];
}

export default function Breadcrumb({ links }: Props) {
	return (
		<nav aria-label="Breadcrumb" className={classes.breadcrumb}>
			<ul>
				<li>
					<a href={home.toPath({})} data-instant aria-current={links.length === 0 ? 'location': undefined}>
						Home
					</a>
				</li>
				{links.map(([title, url], index) => (
					<li>
						<a href={url} data-instant aria-current={index === links.length - 1 ? 'location': undefined}>
							{title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
