import classes from './Breadcrumb.module.css';
import {home} from '../pages';

interface Props {
	links: ([string, string] | null)[];
}

export default function Breadcrumb({ links }: Props) {
	const filteredLinks = links.filter((e): e is [string, string] => !!e);
	if(filteredLinks.length === 0) {
		return null;
	}
	return (
		<nav aria-label="Breadcrumb" className={classes.breadcrumb}>
			<ul>
				<li>
					<a href={home.toPath({ page: '' })} data-instant aria-current={links.length === 0 ? 'location': undefined}>
						Home
					</a>
				</li>
				{filteredLinks.map(([title, url], index) => (
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
