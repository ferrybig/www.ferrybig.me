export default function paginate<T>(input: T[], size: number): T[][] {
	let page: T[] = [];
	const pages: T[][] = [];
	for (const data of input) {
		if (page.length >= size) {
			pages.push(page);
			page = [];
		}
		page.push(data);
	}
	if (page.length > 0) {
		pages.push(page);
	}
	return pages;
}
