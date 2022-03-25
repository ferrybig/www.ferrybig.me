import Feed from '../components/Feed';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import * as routes from '.';
import Fragment from '../components/Fragment';

interface Props {
	base: PageBase,
	pages: number,
	page: string,
	slice: ContentDefinition[],
}

export default function Home(props: Props) {
	return (
		<Feed
			base={props.base}
			title="The website of Fernando van Loenhout"
			page={props.page === '' ? 1 : Number(props.page)}
			pages={props.pages}
			slice={props.slice}
			toPath={(page) => routes.home.toPath({ page })}
			atomFeed={routes.homeAtom.toPath({})}
		>
			{props.page === '' ? (
				<Fragment>
					<p>Hi, I am Fernando, a Full Stack developer, an electronic specialist and a hobbyist.</p>
					<h2>My contributions</h2>
				</Fragment>
			) : null}
		</Feed>
	);
}
