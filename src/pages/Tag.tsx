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
			base={props.base}
			title={'Tag page of ' + (props.tagContent?.title ?? props.tag)}
			page={props.page}
			pages={props.pages}
			slice={props.slice}
			toPath={(page) => routes.tag.toPath({ tag: props.tag, page })}
		>
			test
		</Feed>
	);
}
