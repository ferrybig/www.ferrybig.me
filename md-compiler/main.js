import fs from 'node:fs/promises';
import {compile} from '@mdx-js/mdx';
import remarkMdxImages from 'remark-mdx-images';

const compiled = await compile(
	await fs.readFile('../public/tech/my-new-website/index.md'),
	{
		remarkPlugins: [
			remarkMdxImages,
		],
	}
);

console.log(String(compiled));
