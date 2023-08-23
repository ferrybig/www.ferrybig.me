import { tag } from '.';
import Breadcrumb from '../components/Breadcrumb';
import Link from '../components/Link';
import PageWrapper from '../components/PageWrapper';
import TagCloud from '../components/TagCloud';
import PageBase from '../PageBase';
import titleCase from '../utils/titleCase';
import classes from './AllTags.module.css';

interface Props {
	base: PageBase,
	tagCloudHits: {
		name: string;
		count: number;
		related: Partial<Record<string, number>>;
	}[]
}

export default function AllTags({ base, tagCloudHits }: Props) {
	return (
		<PageWrapper base={base} title="All tags" includeWrapper topWrapper={
			<Breadcrumb links={[
				['All tags', base.link.canonical ?? ''],
			]}/>
		}>
			<h1>All tags</h1>
			<TagCloud tagCloudHits={tagCloudHits}/>
		</PageWrapper>
	);
}
