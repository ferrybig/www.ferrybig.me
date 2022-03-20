import Nav from "../components/Nav";
import RootWrapper from "../components/RootWrapper";
import PageBase from "../PageBase";
import ContentDefinition from "../types/ContentDefinition";

interface Props {
	base: PageBase,
	content: ContentDefinition,
}

export default function Content({ content, base }: Props) {
	return (
		<RootWrapper base={base} title={content.title}>
			<Nav/>
			<pre>{JSON.stringify(content, null, 4)}</pre>
			<div dangerouslySetInnerHTML={{__html: content.default}}/>
		</RootWrapper>
	);
}
