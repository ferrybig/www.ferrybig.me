import favicon150x150 from '@assets/mstile-150x150.png';
export function GET() {
	return new Response(`<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
	<msapplication>
		<tile>
			<square150x150logo src="${favicon150x150}"/>
			<TileColor>#00aba9</TileColor>
		</tile>
	</msapplication>
</browserconfig>
`, { headers: { 'Content-Type': 'application/xml' } });
}
export const dynamic = 'force-static';
