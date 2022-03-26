import Feed from '../components/Feed';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import * as routes from '.';
import Markdown from '../components/Markdown';

interface Props {
	base: PageBase,
	pages: number,
	page: string,
	slice: ContentDefinition[],
	tag: string,
	tagContent: ContentDefinition | null,
	count: number
}

export default function Home(props: Props) {
	return (
		<Feed
			base={props.base}
			title={props.tagContent?.title ?? `Tag ${props.tag.replace('-', ' ')}`}
			page={props.page === '' ? 1 : Number(props.page)}
			pages={props.pages}
			slice={props.slice}
			count={props.count}
			toPath={(page) => routes.tag.toPath({ tag: props.tag, page })}
			atomFeed={routes.tagAtom.toPath({ tag: props.tag})}
		>
			{props.tagContent ? (
				<Markdown
					content={props.tagContent.body}
				/>
			) : null}
		</Feed>
	);
}
