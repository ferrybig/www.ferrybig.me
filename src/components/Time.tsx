import { DateTime } from 'luxon';
import assertNever from '../utils/assert-never';

interface Props {
	dateTime: DateTime,
	format: 'date' | 'date-time'
}

export default function Time({ dateTime, format }: Props) {
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
		<time dateTime={digital} title={digital}>
			{formatted}
		</time>
	);
}
