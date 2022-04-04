import Feed from '../components/Feed';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import * as routes from '.';
import Fragment from '../components/Fragment';
import TagCloud from '../components/TagCloud';
import { TagCloudHit } from '../content';
import Link from '../components/Link';

interface Props {
	base: PageBase,
	pages: number,
	page: string,
	count: number,
	slice: ContentDefinition[],
	tagCloudHits: TagCloudHit[],
}

export default function Home(props: Props) {
	return (
		<Feed
			base={props.base}
			title="Hi, I'm Fernando van Loenhout"
			page={props.page === '' ? 1 : Number(props.page)}
			pages={props.pages}
			slice={props.slice}
			count={props.count}
			toPath={(page) => routes.home.toPath({ page })}
			atomFeed={routes.homeAtom.toPath({})}
		>
			{props.page === '' ? (
				<Fragment>
					<p>
						I am a Full Stack developer, an electronic specialist and a hobbyist. I like to{' '}
						talk about many technical things, so be prepared to read everything I want to tell you.{' '}
						Blogging is a fun thing to do, and I occasionally post content here. I also do{' '}
						development work in my hobby time, mainly to improve my skill levels. This website{' '}
						was not possible to make if I was not at the skill level that I am today. If you ask any{' '}
						fellow programmer, they will say making the following hexagon layout is one of the{' '}
						hardest things to make.
					</p>
					<h2><Link route={routes.allTags} props={{}}>All tags</Link></h2>
					<TagCloud tagCloudHits={props.tagCloudHits}/>
				</Fragment>
			) : null}
		</Feed>
	);
}
