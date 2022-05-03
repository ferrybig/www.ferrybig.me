import titleCase from '../utils/titleCase';
import classes from './RepoCard.module.css';

interface Props {
	repo: string;
}

export default function RepoCard({
	repo,
}: Props) {
	let type;
	if(repo.startsWith('https://github.com/')) {
		type = 'Github repository';
	} else {
		type = 'Git repository';
	}

	const projectName = titleCase(repo.substring(repo.lastIndexOf('/', repo.lastIndexOf('/') -1) + 1, repo.lastIndexOf('/')).replace(/-/g, ' '));
	return (
		<aside className={classes.root}>
			<p className={classes.name}><a href={repo}>{projectName}</a></p>
			<p className={classes.type}>{type}</p>
		</aside>
	);
}
