import Feed from '../components/Feed';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import * as routes from '.';
import Fragment from '../components/Fragment';

interface Props {
	base: PageBase,
	pages: number,
	page: string,
	count: number,
	slice: ContentDefinition[],
}

export default function Home(props: Props) {
	return (
		<Feed
			base={props.base}
			title=""
			page={props.page === '' ? 1 : Number(props.page)}
			pages={props.pages}
			slice={props.slice}
			count={props.count}
			toPath={(page) => routes.home.toPath({ page })}
			atomFeed={routes.homeAtom.toPath({})}
		>
			{props.page === '' ? (
				<Fragment>
					<p>Hi, I am Fernando, a Full Stack developer, an electronic specialist and a hobbyist. I like to talk about many technical things, so be prepared to read everything I want to tell you. </p>
					{/*<h2>My contributions</h2>*/}
				</Fragment>
			) : null}
		</Feed>
	);
}
