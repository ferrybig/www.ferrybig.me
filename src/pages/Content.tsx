import { byYear, byMonth, blog } from ".";
import Breadcrumb from "../components/Breadcrumb";
import PageWrapper from "../components/PageWrapper";
import PageBase from "../PageBase";
import ContentDefinition from "../types/ContentDefinition";

var monthNames = [
	"January", "February", "March",
	"April", "May", "June",
	"July", "August", "September",
	"October", "November", "December"
];

interface Props {
	base: PageBase,
	content: ContentDefinition,
}

export default function Content({ content, base }: Props) {
	return (
		<PageWrapper base={base} title={content.title}>
			<Breadcrumb links={[
				[content.date.substring(0, 4), byYear.toPath({
					year: content.date.substring(0, 4)
				})],
				[monthNames[Number.parseInt(content.date.substring(5, 7), 10) - 1], byMonth.toPath({
					year: content.date.substring(0, 4),
					month: content.date.substring(5, 7),
				})],
				[content.title, blog.toPath({
					slug: content.slug
				})]
			]}/>
			<pre>{JSON.stringify(content, null, 4)}</pre>
			<article>
				<h1 dangerouslySetInnerHTML={{__html: content.titleHTML}}/>
				<dl>
					<dt>Created</dt><dd><time dateTime={content.date}>{content.date}</time></dd>
					{content.endDate && <dt>Ended</dt>}
					{content.endDate && <dd><time dateTime={content.endDate}>{content.endDate}</time></dd>}
					<dt>Published</dt><dd><time dateTime={content.created}>{content.created}</time></dd>
					<dt>Updated</dt><dd><time dateTime={content.updated}>{content.updated}</time></dd>
				</dl>
				<div dangerouslySetInnerHTML={{__html: content.body}}/>
			</article>
		</PageWrapper>
	);
}
