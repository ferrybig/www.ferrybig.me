import classes from './Subscribe.module.css';

interface Props {
	atomFeed: string
}

export default function Subscribe({ atomFeed }: Props) {
	return (
		<p>
			<a href={atomFeed} target="_blank" rel="noopener noreferrer" type="application/atom+xml" className={classes.feed} aria-label="Subscribe via an atom feed reader"/>
		</p>
	);
}
