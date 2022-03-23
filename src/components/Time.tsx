import { DateTime } from 'luxon'
import assertNever from '../utils/assert-never';

interface Props {
	dateTime: string,
	from: 'iso' | 'rfc'
	format: 'date' | 'date-time'
}

export default function Time({ dateTime: input, from, format }: Props) {
	let dateTime;
	switch(from) {
	case 'iso':
		dateTime = DateTime.fromISO(input);
		break;
	case 'rfc':
		dateTime = DateTime.fromRFC2822(input);
		break;
	default:
		dateTime = assertNever(from);
	}
	dateTime.setLocale('en_NL');
	let formatted;
	let digital;
	switch (format) {
	case 'date':
		formatted = dateTime.toLocaleString({ dateStyle: 'long' });
		digital = dateTime.toISODate();
		break;
	case 'date-time':
		formatted = dateTime.toLocaleString({ dateStyle: 'long', timeStyle: 'short', hour12: false });
		digital = dateTime.toISO();
		break;
	default:
		dateTime = assertNever(format);
	}
	return (
		<time
			dateTime={digital}
			title={digital}
		>
			{formatted}
		</time>
	)
}
