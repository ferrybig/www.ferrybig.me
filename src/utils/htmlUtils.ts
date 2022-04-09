export const selfClosing: Partial<Record<string, true>> = {
	area: true,
	base: true,
	br: true,
	col: true,
	embed: true,
	hr: true,
	img: true,
	input: true,
	link: true,
	meta: true,
	param: true,
	source: true,
	track: true,
	wbr: true,
};


export function escape(input: unknown): string {
	switch(typeof input) {
	case 'bigint':
	case 'boolean':
	case 'undefined':
	case 'number':
		return `${input}`;
	case 'object':
	case 'symbol':
		return escape(JSON.stringify(input));
	case 'function':
		return escape(`${input}`);
	case 'string':
		return input
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	default:
		throw new Error('Unknown type: ' + typeof input);
	}
}


export const translateMap: Partial<Record<string, string>> = {
	className: 'class',
	htmlFor: 'for',
	dateTime: 'datetime',
};

export function escapeArgument([key, value]: [string, unknown]): string {
	if (value === true) return ` ${escape(translateMap[key] ?? key)}`;
	if (value === false) return '';
	if (value === undefined) return '';
	return ` ${escape(translateMap[key] ?? key)}="${escape(value)}"`;
}

export function decodeEntities(encodedString: string) {
	const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	const translate: Partial<Record<string, string>> = {
		'nbsp':' ',
		'amp' : '&',
		'quot': '"',
		'lt'  : '<',
		'gt'  : '>',
	};
	return encodedString.replace(translate_re, function(match, entity) {
		return translate[entity] ?? '';
	}).replace(/&#(\d+);/gi, function(match, numStr) {
		const num = parseInt(numStr, 10);
		return String.fromCharCode(num);
	});
}
