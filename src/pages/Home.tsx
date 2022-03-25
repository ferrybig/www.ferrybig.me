import Feed from '../components/Feed';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import * as routes from '.';

interface Props {
	base: PageBase,
	pages: number,
	page: number,
	slice: ContentDefinition[],
}

export default function Home(props: Props) {
	return (
		<Feed
			base={{
				...props.base,
				head: [
					...props.base.head,
					<link href={routes.homeAtom.toPath({})} rel="alternate" type="application/atom+xml"/>
				]
			}}
			title="Fernando's Development website"
			page={props.page}
			pages={props.pages}
			slice={props.slice}
			toPath={(page) => routes.home.toPath({ page })}
		>
			test
		</Feed>
	);
}
