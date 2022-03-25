import Nav from '../components/Nav';
import PageWrapper from '../components/PageWrapper';
import RootWrapper from '../components/RootWrapper';
import PageBase from '../PageBase';

interface Props {
	base: PageBase,
}

export default function Home({ ...rootProps }: Props) {
	return (
		<PageWrapper {...rootProps} title="Fernando's Development area">
			test
		</PageWrapper>
	);
}