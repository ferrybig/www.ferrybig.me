import Breadcrumb from '../components/Breadcrumb';
import PageWrapper from '../components/PageWrapper';
import PageBase from '../PageBase';

interface Props {
	base: PageBase,
}

export default function Credits({ base }: Props) {
	return (
		<PageWrapper base={base} title="Fernando's Development area" includeWrapper topWrapper={
			<Breadcrumb links={[
				['Credits', base.link.canonical ?? '']
			]}/>
		}>
			<h1>Credits</h1>
			<p>The best products are made in collaboration with others, including this website. Properly attributing credit is important</p>
			<ul>
				<li>
					<h2><a href="https://github.com/gilbarbara/logos">Svg Logo&apos;s by Gil&nbsp;Barbara</a></h2>
					<p>These are the icons I used in the background of the page header. This is licensed under CC0</p>
				</li>
			</ul>
		</PageWrapper>
	);
}
