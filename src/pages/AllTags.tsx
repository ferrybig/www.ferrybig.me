import { tag } from '.';
import Breadcrumb from '../components/Breadcrumb';
import Link from '../components/Link';
import PageWrapper from '../components/PageWrapper';
import PageBase from '../PageBase';
import titleCase from '../utils/titleCase';
import classes from './AllTags.module.css';

interface Props {
	base: PageBase,
	tags: {
		name: string;
		count: number;
		related: Partial<Record<string, number>>;
	}[]
}

export default function AllTags({ base, tags }: Props) {
	return (
		<PageWrapper base={base} title="All tags" includeWrapper topWrapper={
			<Breadcrumb links={[
				['All tags', base.link.canonical ?? '']
			]}/>
		}>
			<h1>All tags</h1>
			<p>This is an overview of all used tags in the blog pages</p>
			<div className={classes.table}>
				<table>
					<colgroup>
						<col/>
					</colgroup>
					<thead>
						<tr>
							<th/>
							{tags.map(t => (
								<th>
									<Link route={tag} props={{ tag: t.name, page: '' }}>{titleCase(t.name.replace('-', ' '))}</Link>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{tags.map(t => (
							<tr>
								<th>
									<Link route={tag} props={{ tag: t.name, page: '' }}>{titleCase(t.name.replace('-', ' '))}</Link>
								</th>
								{tags.map(t1 => (
									<td>
										{t1 !== t && t.related[t1.name] ? t.related[t1.name] : null}
									</td>
								))}
							</tr>
						))}
					</tbody>
					<caption>
						Table showing how many times combination between 2 different tags happen on the page
					</caption>
				</table>
			</div>
		</PageWrapper>
	);
}
