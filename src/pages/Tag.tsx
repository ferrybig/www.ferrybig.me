import Feed from '../components/Feed';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import * as routes from '.';

interface Props {
	base: PageBase,
	pages: number,
	page: number,
	slice: ContentDefinition[],
	tag: string,
	tagContent: ContentDefinition | null,
}

export default function Home(props: Props) {
	return (
		<Feed
			base={{
				...props.base,
				head: [
					...props.base.head,
					<link href={routes.tagAtom.toPath({ tag: props.tag})} rel="alternate" type="application/atom+xml"/>
				]
			}}
			title={'Tag page of ' + (props.tagContent?.title ?? props.tag)}
			page={props.page}
			pages={props.pages}
			slice={props.slice}
			toPath={(page) => routes.tag.toPath({ tag: props.tag, page })}
		>
			<a href={routes.tagAtom.toPath({ tag: props.tag })}>View in atom feed reader</a>
		</Feed>
	);
}
