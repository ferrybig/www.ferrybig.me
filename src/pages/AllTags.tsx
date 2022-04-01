import { tag } from '.';
import Breadcrumb from '../components/Breadcrumb';
import Fragment from '../components/Fragment';
import Link from '../components/Link';
import PageWrapper from '../components/PageWrapper';
import PageBase from '../PageBase';
import titleCase from '../utils/titleCase';

interface TagProps {
	tag: {
		name: string;
		count: number;
		related: Partial<Record<string, number>>;
	}
}

function Tag ({ tag: t }: TagProps) {
	const related = Object.entries(t.related);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	related.sort(([,a], [,b]) => b! - a!);
	const bestMatches = related.slice(0, 10);
	const remaining = related.length - bestMatches.length;
	return (
		<Fragment>
			<h2><Link route={tag} props={{ tag: t.name, page: '' }}>{titleCase(t.name.replace('-', ' '))}</Link></h2>
			<p>This tag is used under {t.count} article{t.count !== 1 && 's'}{bestMatches.length > 0 && ', and related to the following tags:'}</p>
			<ul>
				{bestMatches.map(([r, count]) => (
					<li>
						<Link route={tag} props={{ tag: r, page: '' }}>{titleCase(r.replace('-', ' '))}</Link>
						{' '}
						by having {count} articles in common.
					</li>
				))}
				{remaining > 0 && <li><em>{remaining} more not shown...</em></li>}
			</ul>
		</Fragment>
	);
}

interface Props {
	base: PageBase,
	tags: {
		name: string;
		count: number;
		related: Partial<Record<string, number>>;
	}[]
}

export default function Credits({ base, tags }: Props) {
	return (
		<PageWrapper base={base} title="All tags" includeWrapper topWrapper={
			<Breadcrumb links={[
				['All tags', base.link.canonical ?? '']
			]}/>
		}>
			<h1>All tags</h1>
			<p>This is an overview of all used tags in the blog pages</p>
			{tags.map(t => (
				<Tag tag={t}/>
			))}
		</PageWrapper>
	);
}
