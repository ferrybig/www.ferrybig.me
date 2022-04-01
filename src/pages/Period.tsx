import Breadcrumb from '../components/Breadcrumb';
import PageWrapper from '../components/PageWrapper';
import PageBase from '../PageBase';

interface Props {
	base: PageBase,
}

export default function Period({ base }: Props) {
	return (
		<PageWrapper base={base} title="Periods" includeWrapper topWrapper={
			<Breadcrumb links={[
				['Periods', base.link.canonical ?? '']
			]}/>
		}>
			<p>TODO: Make this page with a calender widget</p>
		</PageWrapper>
	);
}
