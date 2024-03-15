import { BASE_DIR } from '@/metadata';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';

async function processFile(file: string): Promise<{ content: string, data: Record<string, unknown>, filename: string }> {
	const raw = await readFile(BASE_DIR + file, { encoding: 'utf8'});

	return {
		...matter(raw),
		filename: BASE_DIR + file,
	};

}
export default processFile;
