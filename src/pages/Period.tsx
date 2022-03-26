import PageWrapper from '../components/PageWrapper';
import PageBase from '../PageBase';

interface Props {
	base: PageBase,
}

export default function Period({ base }: Props) {
	return (
		<PageWrapper base={base} title="Fernando's Development area" includeWrapper>
			<pre>{base.tagCloudHits}</pre>
		</PageWrapper>
	);
}
