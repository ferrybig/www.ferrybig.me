const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augustus', 'September', 'October', 'November', 'December'];

interface Date {
	timestamp: string
}

function Date({ timestamp }:Date) {
	let match: RegExpExecArray | null;
	if (/^\d{4}$/.test(timestamp)) {
		return <time dateTime={timestamp}>{timestamp}</time>;
	}
	if ((match = /^(\d{4})-(\d{2})$/.exec(timestamp)) !== null) {
		return <time dateTime={timestamp}>{months[Number.parseInt(match[2], 10) - 1]} {match[1]}</time>;
	}
	if ((match = /^(\d{4})-(\d{2})-(\d{2})T?/.exec(timestamp)) !== null) {
		return <time dateTime={timestamp}>{months[Number.parseInt(match[2], 10) - 1]} {Number.parseInt(match[3], 10)}, {match[1]}</time>;
	}
	throw new Error(`Unknown date format: ${timestamp}`);
}
export default Date;
