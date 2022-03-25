import classes from './Markdown.module.css';

interface Props {
	content: string,
}

export default function Markdown({ content }: Props) {
	return (
		<div className={classes.markdown} dangerouslySetInnerHTML={{__html: content}}/>
	);
}
