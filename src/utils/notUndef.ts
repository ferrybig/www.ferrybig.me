export default function notUndef<T>(input: T): NonNullable<T> {
	if (input === null || input === undefined) {
		throw new Error('Expected non undefined/null, got: ' + typeof input);
	}
	return input as NonNullable<T>;
}
