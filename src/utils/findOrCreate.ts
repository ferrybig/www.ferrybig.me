export default function findOrCreate<T>(arr: T[], find: (input: T) => boolean, create: () => T): T {
	const maybe = arr.findIndex(find);
	if (maybe === -1) {
		const newValue = create();
		arr.push(newValue);
		return newValue;
	}
	return arr[maybe];
}
