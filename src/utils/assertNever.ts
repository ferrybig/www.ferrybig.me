export default function assertNever(input: never): never {
	throw new Error('Expected never, got: ' + JSON.stringify(input));
}
