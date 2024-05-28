
interface GoatCounterVars {
	path?: string
	title?: string
	referrer?: string
	event?: boolean
}
interface GoatcounterConfig extends GoatCounterVars {
	endpoint: string
	no_onload?: boolean,
	allow_local?: boolean,
	no_events?: boolean
	allow_frame?: boolean
}
interface Goatcounter extends GoatcounterConfig {
	count: (data: GoatCounterVars) => void
	filter: () => false | string
	url: (data: GoatCounterVars) => string
	get_query: (key: string) => string
	bind_events: () => void
	visit_count: (opt?: {
		type?: 'html' | 'png' | 'svg' | undefined,
		append?: string | undefined,
		path?: string | undefined,
		attr?: {
			width: string | undefined
			height: string | undefined
		}
	}) => void
}
export default function setupGoatcounter(config: GoatcounterConfig): Goatcounter;
