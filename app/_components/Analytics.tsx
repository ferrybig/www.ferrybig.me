'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
//import { useReportWebVitals } from 'next/web-vitals';

declare global {
	interface Window {
		goatcounter: GoatcounterConfig
	}
}
interface GoatcounterConfig {
	endpoint: string
	no_onload: boolean,
	allow_local: boolean,
}
interface Goatcounter extends GoatcounterConfig {
	count: (data: {
		path: string
		event?: boolean,
		title?: string
	}) => void
}
async function analytics(): Promise<Goatcounter> {
	window.goatcounter ??= {
		endpoint: 'https://analytics.ferrybig.me/count',
		no_onload: true,
		allow_local: true,
	};
	const { default: goatcounter } = await import('./Analytics.goatcounter');
	return goatcounter as Goatcounter;
}
let eventPromise = Promise.resolve();
export function scheduleEvent(event: Parameters<Goatcounter['count']>[0]) {
	eventPromise = eventPromise.then(() => {
		analytics().then(goatcounter => {
			goatcounter.count(event);
		});
		return new Promise((resolve) => setTimeout(resolve, 1000));
	});
}

export function Analytics() {
	const path = usePathname();
	useEffect(() => {
		analytics().then(goatcounter => {
			goatcounter.count({
				path,
			});
		});
	}, [path]);
	/*
	useReportWebVitals((metric) => {
		scheduleEvent({
			path,
			event: true,
			title: metric.name,
		});
	});
	*/
	return null;
}
