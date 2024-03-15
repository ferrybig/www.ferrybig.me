'use client';

import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { useEffect, useRef } from 'react';

type Impression =
| {
	eventType: 'load'
	referrer: string | null,
	type: 'reload' | 'navigate' | 'back_forward' | null,
}
| {
	eventType: 'navigate'
	page: string,
	//visibleTime: number
}
/*| {
	eventType: 'hide'
	page: string,
	visibleTime: number
}*/
| {
	eventType: 'outbound'
	url: string,
	//visibleTime: number
}
| {
	eventType: 'timings'
	metric: string,
	value: number
}

function findLastEventOfType<T extends Impression['eventType']>(events: readonly Impression[], key: T): [number, Extract<Impression, {eventType: T}> | null] {
	const index = events.findLastIndex(e => e.eventType === key);
	if (index >= 0) {
		return [index, events[index] as Extract<Impression, {eventType: T}>];
	} else {
		return [-1, null];
	}
}
declare global {
	interface Document {
		prerendering?: boolean
	}
}

export function Analytics() {
	const impressions = useRef<Impression[]>([]);
	const sessionId = useRef('');
	//const timer = useRef<number>(Date.now());
	const path = usePathname();
	const ourPath = useRef(path);
	useEffect(() => {
		{
			/*if (document.prerendering) {
				document.addEventListener('prerenderingchange', () => {
					timer.current = Date.now();
				}, {
					once: true,
				});
			}*/

			sessionId.current = crypto.randomUUID();
			const entries = window.performance
				.getEntriesByType('navigation')
				.map((nav) => (nav as PerformanceNavigationTiming).type);
			const navigationType = entries.find((e): e is 'reload' | 'navigate' | 'back_forward' => ['reload', 'navigate', 'back_forward'].includes(e)) ?? null;

			const [index, last] = findLastEventOfType(impressions.current, 'load');
			if (last) {
				impressions.current.splice(index, 1);
			}
			impressions.current.push({
				eventType: 'load',
				referrer: document.referrer || null,
				type: navigationType,
			});
		}
		function flushQueue() {
			if (impressions.current.length == 0) {
				return;
			}
			const body = JSON.stringify({
				impressions: impressions.current,
				sessionId: sessionId.current,
			});
			impressions.current.length = 0;
			if (navigator.sendBeacon) {
				navigator.sendBeacon('https://analytics.ferrybig.me/www.ferrybig.me', body);
			} else {
				fetch('https://analytics.ferrybig.me/www.ferrybig.me', {
					body,
					headers: {
						'content-type': 'application/json',
					},
					method:'POST',
					keepalive: true,
				});
			}
		}

		const visibilityChange =  () => {
			if (document.visibilityState === 'hidden') {
				/*
				impressions.current.push({
					eventType: 'hide',
					page: ourPath.current,
					visibleTime: Date.now() - timer.current,
				});
				*/
				flushQueue();
			} else {
				//timer.current = Date.now();
			}
		};

		function anchorClick(e: MouseEvent) {
			let target: ParentNode| null = e.target as ParentNode;
			while (target) {
				if (target instanceof HTMLAnchorElement) {
					if (new URL(target.href).origin !== window.location.origin) {
						impressions.current.push({
							eventType: 'outbound',
							url: target.href,
							//visibleTime: Date.now() - timer.current,
						});
					}
					return;
				}
				target = target.parentNode;
			}
		}
		addEventListener('visibilitychange', visibilityChange, { passive: true });
		addEventListener('click', anchorClick, { passive: true });
		return () => {
			removeEventListener('visibilitychange', visibilityChange);
			removeEventListener('click', anchorClick);
		};
	}, []);
	useEffect(() => {
		const [index, last] = findLastEventOfType(impressions.current, 'navigate');
		if (last?.page == path) {
			impressions.current.splice(index, 1);
		}
		impressions.current.push({
			eventType: 'navigate',
			page: path,
			//visibleTime: Math.max(Date.now() - timer.current, last?.visibleTime ?? 0),
		});
		ourPath.current = path;
		//timer.current = Date.now();
	}, [path]);
	useReportWebVitals((metric) => {
		const [index, last] = findLastEventOfType(impressions.current, 'timings');
		if (last?.metric == metric.name) {
			impressions.current.splice(index, 1);
		}
		impressions.current.push({
			eventType: 'timings',
			metric: metric.name,
			value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
		});
	});
	return null;
}
