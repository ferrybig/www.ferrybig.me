export default function titleCase(input: string) {
	if (input === '') return input;
	return input[0].toUpperCase() + input.substring(1);
}
