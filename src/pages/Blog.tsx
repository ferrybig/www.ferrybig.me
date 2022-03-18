import Nav from "../components/Nav";
import RootWrapper from "../components/RootWrapper";
import PageBase from "../PageBase";

interface Props {
	base: PageBase,
	blog: { default: string },
}

export default function Home({ blog, ...rootprops }: Props) {
	return (
		<RootWrapper {...rootprops} title="Fernando's Blog area">
			<Nav/>
			<pre>{JSON.stringify(blog, null, 4)}</pre>
			<div dangerouslySetInnerHTML={{__html: blog.default}}/>
		</RootWrapper>
	);
}
