import Nav from "../components/Nav";
import RootWrapper from "../components/RootWrapper";
import PageBase from "../PageBase";

export interface BlogDefinition {
	default: string;
	date: string
	endDate?: string | null
	slug: string
	tags: string[]
	extraTags: string[]
}

interface Props {
	base: PageBase,
	blog: BlogDefinition,
}

export default function Blog({ blog, ...rootprops }: Props) {
	return (
		<RootWrapper {...rootprops} title="Fernando's Blog area">
			<Nav/>
			<pre>{JSON.stringify(blog, null, 4)}</pre>
			<div dangerouslySetInnerHTML={{__html: blog.default}}/>
		</RootWrapper>
	);
}
