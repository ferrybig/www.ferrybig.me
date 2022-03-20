import Nav from "../components/Nav";
import RootWrapper from "../components/RootWrapper";
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
		<RootWrapper base={base} title="Fernando's Development area">
			<Nav/>
			<ul>
				{Object.entries(grouped).map(([key, entries]) => (
					<li>
						<p>Rendered by: <code>{key}</code></p>
						<ul>
							{entries.map(e => (
								<li>
									<a href={e.loc}>
										{e.file}
									</a>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
			
		</RootWrapper>
	);
}
