import Nav from "../components/Nav";
import RootWrapper from "../components/RootWrapper";
import PageBase from "../PageBase";

interface Props {
	base: PageBase,
}

export default function Home({ ...rootprops }: Props) {
	return (
		<RootWrapper {...rootprops} title="Fernando's Development area">
			<Nav/>
			test
		</RootWrapper>
	);
}
