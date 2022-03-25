import classes from './Markdown.module.css';
import { JSXNode } from '../jsx/jsx-runtime';
import Fragment from './Fragment';

interface Props {
	title?: string
	content: string,
	children?: JSXNode,
}

export default function Markdown({ content, title, children }: Props) {
	return (
		<Fragment>
			{typeof title === 'string' ? <h1 dangerouslySetInnerHTML={{__html: title}}/> : null}
			{children}
			<div className={classes.markdown} dangerouslySetInnerHTML={{__html: content}}/>
		</Fragment>
	);
}
