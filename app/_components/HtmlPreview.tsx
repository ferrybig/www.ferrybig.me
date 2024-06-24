'use client';

import { useEffect, useRef } from 'react';
import classes from './HtmlPreview.module.css';

interface HtmlPreview {
	html: string;
}
function HtmPreview({html}: HtmlPreview) {
	const output = useRef<HTMLDivElement>(null);
	const shadow = useRef<ShadowRoot | null>(null);
	useEffect(() => {
		const element = output.current;
		if (!element) return;
		if (shadow.current == null || shadow.current.host !== element) {
			shadow.current = element.attachShadow({ mode: 'open' });
		}

		shadow.current.innerHTML = html;
	}, [html]);
	return <div ref={output} className={classes.root}/>;
}
export default HtmPreview;
