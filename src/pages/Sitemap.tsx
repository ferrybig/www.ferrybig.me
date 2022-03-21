import PageWrapper from "../components/PageWrapper";
import PageBase, { SitemapEntry } from "../PageBase";

interface Props {
	base: PageBase,
}

export default function Home({ base }: Props) {
	const grouped: Record<string, SitemapEntry[]> = {};
	for (const entry of base.urls) {
		(grouped[entry.renderedBy] ??= []).push(entry);
	}
	return (
		<PageWrapper base={base} title="Fernando's Development area">
			<ul>
				{Object.entries(grouped).map(([key, entries]) => (
					<li>
						<p>Rendered by: <code>{key}</code></p>
						<ul>
							{entries.map(e => (
								<li>
									<a href={e.loc} data-instant>
										{e.file}
									</a>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</PageWrapper>
	);
}
