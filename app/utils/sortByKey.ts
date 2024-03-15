export default function sortByKey<T>(array: T[], key: keyof T) {

	return array.sort(function(a, b) {
		const x = a[key];
		const y = b[key];
		if (x === null && y !== null) return 1;
		if (y === null && x !== null) return -1;
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});

}
