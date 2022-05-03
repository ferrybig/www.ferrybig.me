import assertNever from './assertNever';
import { selfClosing } from './htmlUtils';

export type EscapedToken = {
	type: 'text'
	text: string,
} | {
	type: 'tag'
	tag: string,
	start: boolean,
	end: boolean,
	attr: {
		name: string,
		quote: string,
		value: string | null,
	}[]
} | {
	type: 'comment'
	text: string,
};

type Parser = (input: string, startIndex: number) => [number, EscapedToken | null, Parser | null];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseComment(input: string, startIndex: number): [number, EscapedToken | null, Parser | null] {
	throw new Error('Not implemented');
}
function parseTagTryWriteAttribute(
	input: string,
	attrStartIndex: number | null,
	attrEndIndex: number,
	lastQuote: string | null,
	attr: {
		name: string,
		quote: string,
		value: string | null,
	}[]
) {
	if (attrStartIndex !== null && attrEndIndex - attrStartIndex >= 1) {
		const data = input.substring(attrStartIndex, attrEndIndex);
		const equals = data.indexOf('=');
		if (equals < 0) {
			attr.push({
				name: data,
				quote: '',
				value: null,
			});
		} else {
			const name = data.substring(0, equals);
			const value = data.substring(equals + 1);
			const stripStart = lastQuote && value.startsWith(lastQuote) ? 1 : 0;
			const stripEnd = lastQuote && value.endsWith(lastQuote) ? 1 : 0;
			attr.push({
				name,
				quote: lastQuote ?? '',
				value: value.substring(stripStart, value.length - stripEnd),
			});
		}
	}
}
function parseTag(input: string, startIndex: number): [number, EscapedToken | null, Parser | null] {
	let index = startIndex;
	let attrStartIndex: number | null = null;
	let lastQuote: string | null = null;
	let quote: string | null = null;
	const attr: {
		name: string,
		quote: string,
		value: string | null,
	}[] = [];
	let end = false;
	let start = true;
	for (; index < input.length; index++) {
		// console.log({
		// 	char: input[index],
		// 	quote,
		// 	attrStartIndex,
		// });
		if (input[index] === '>') {
			if (quote === null) {
				parseTagTryWriteAttribute(input, attrStartIndex, index, lastQuote, attr);
				attrStartIndex = null;
				lastQuote = null;
				// console.log(attr)
				const tag = attr.shift()?.name ?? '';
				end = end || !!selfClosing[tag];
				return [
					index - startIndex + 1,
					{
						type: 'tag',
						end,
						start,
						attr,
						tag,
					},
					// eslint-disable-next-line @typescript-eslint/no-use-before-define
					parseText,
				];
			}
		} else if (input[index] === '<') {
			if (index - startIndex !== 0) {
				throw new Error('Unexpected: <');
			}
		} else if (input[index] === '!') {
			if (index - startIndex !== 1) {
				throw new Error('Unexpected: !');
			}
			return [0, null, parseComment];
		} else if (input[index] === '/') {
			if (quote === null) {
				if (index - startIndex === 1) {
					start = false;
				}
				end = true;
				parseTagTryWriteAttribute(input, attrStartIndex, index, lastQuote, attr);
				attrStartIndex = null;
				lastQuote = null;
			}
		} else if (input[index] === quote) {
			quote = null;
		} else if (input[index] === '"' || input[index] === '\'') {
			if (quote === null) {
				quote = input[index];
				lastQuote = quote;
			}
		} else if (/\s/.test(input[index])) {
			if (quote === null) {
				parseTagTryWriteAttribute(input, attrStartIndex, index, lastQuote, attr);
				attrStartIndex = null;
				lastQuote = null;
			}
		} else {
			if (attrStartIndex == null) {
				attrStartIndex = index;
			}
		}
	}
	throw new Error('Input did not end with >');
}
function parseText(input: string, startIndex: number): [number, EscapedToken | null, Parser | null] {
	let index = startIndex;
	for (; index < input.length; index++) {
		switch (input[index]) {
		case '<':
			return [
				index - startIndex,
				index - startIndex === 0 ? null : { type:'text', text: input.substring(startIndex, index)},
				parseTag,
			];
		}
	}
	return [
		index - startIndex,
		index - startIndex === 0 ? null : { type:'text', text: input.substring(startIndex, index)},
		null,
	];
}

export function* parseHtml(input: string, startIndex = 0): Generator<EscapedToken, void, unknown> {
	let index = startIndex;
	let parser: Parser | null = parseText;
	while (parser != null) {
		const [consumed, token, newParser] = parser(input, index);
		index += consumed;

		// console.log({
		// 	token,
		// 	index,
		// 	nextChar: input[index],
		// 	newParser,
		//});
		if (token) {
			yield token;
		}
		parser = newParser;
	}
}

export function writeHtml(tokens: EscapedToken[], {xhtml = false, balance = true}: {xhtml?: boolean, balance?: boolean}) {
	let html = '';
	const openTags: Extract<EscapedToken, {type: 'tag'}>[] = [];
	for (const token of tokens) {
		// console.log('Writing', token);
		switch (token.type) {
		case 'text':
			html += token.text;
			break;
		case 'comment':
			html += `<!--${token.text}-->`;
			break;
		case 'tag':
			if (token.start) {
				if (!token.end) {
					openTags.push(token);
				}
				html += `<${token.tag}`;
				html += `${token.attr.map(a => ` ${a.name}${a.value === null && !xhtml ? '' : `=${a.quote}${a.value ?? ''}${a.quote}`}`).join('')}`;
				if (token.end && xhtml) {
					html += '/';
				}
				html += '>';
			} else if (token.end) {
				let lastToken;
				while (openTags.length > 0 && (lastToken = openTags.pop())?.tag !== token.tag && lastToken) {
					html += `</${lastToken.tag}>`;
				}
				html += `</${token.tag}>`;
			}
			break;
		default:
			assertNever(token);
		}
	}
	if (balance) {
		let lastToken;
		// eslint-disable-next-line no-cond-assign
		while (lastToken = openTags.pop()) {
			html += `</${lastToken.tag}>`;
		}
	}
	return html;
}
