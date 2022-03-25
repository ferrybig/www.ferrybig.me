import { ReactNode } from 'react';
import assertNever from '../utils/assert-never';
import { createElement, RAW_TAG_MARKER } from '../jsx/jsx-runtime';

interface Props {
	children: ReactNode;
	format: 'xml' | 'html';
}

export default function Output({
	children,
	format: type,
}: Props): JSX.Element {
	switch(type) {
	case 'html':
		return createElement(RAW_TAG_MARKER, {
			start: '<!DOCTYPE html>\n',
			end: '',
			mode: 'html',
		}, children);
	case 'xml':
		return createElement(RAW_TAG_MARKER, {
			start: '<?xml version="1.0" encoding="utf-8"?>\n',
			end: '',
			mode: 'xml',
		}, children);
	default:
		return assertNever(type);
	}
	
}
