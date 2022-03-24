import PageWrapper from "../components/PageWrapper";
import PageBase from "../PageBase";
import ContentDefinition from "../types/ContentDefinition";

interface Props {
	base: PageBase,
	blogs: ContentDefinition[][],
	slice: ContentDefinition[]
}

export default function Home({ ...rootProps }: Props) {
	return (
		<PageWrapper {...rootProps} title="Fernando's Development area">
			test
		</PageWrapper>
	);
}
