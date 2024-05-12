import type {
	CompileResults,
	CompileResultsArticle,
	CompileResultsFile,
	CompileResultsSubTasks,
	Config,
} from '../types.js';

const typeofPriority: Record<'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function', number> = {
	string: 0,
	number: 1,
	boolean: 2,
	object: 3,
	bigint: 4,
	function: 5,
	symbol: 6,
	undefined: 7,
};

function sortBy<T>(
	base: T[],
	array: number[],
	...resolvers: ((instance: T) => unknown)[]
): void {
	array.sort((a, b) => {
		for (const resolver of resolvers) {
			const aValue = resolver(base[a]);
			const bValue = resolver(base[b]);
			const aType = typeof aValue;
			const bType = typeof bValue;
			const aPriority = typeofPriority[aType];
			const bPriority = typeofPriority[bType];
			if (aPriority < bPriority) return -1;
			if (aPriority > bPriority) return 1;

			switch (aType) {
			case 'string':
			case 'number':
			case 'bigint':
			case 'boolean':
				if (aValue as any < (bValue as any)) return -1;
				if (aValue as any > (bValue as any)) return 1;
				break;
			default:
				if (aValue !== bValue) {
					throw new Error(`Cannot compare ${aType} values`);
				}
			}
		}
		return 0;
	});
}

export default function makeContent(
	results: Exclude<CompileResults, CompileResultsSubTasks>[],
	{miniumForFeedGeneration}: Config
): CompileResultsFile {
	let importId = 0;
	const importMap = new Map<string, string>();
	const articles = results.filter(
		(x): x is CompileResultsArticle => x.type === 'article'
	);
	const children: number[][] = [];
	const topicIndex: number[] = [];
	const slugMap = new Map<string, number>();
	const directChildren: number[] = [];
	const indirectChildren: number[] = [];
	for (let i = 0; i < articles.length; i++) {
		const article = articles[i];
		children.push([]);
		slugMap.set(article.metadata.slug, i);
	}
	let postsContent = 'const posts = [\n';
	for (let i = 0; i < articles.length; i++) {
		const article = articles[i];
		postsContent += '\t';
		postsContent += JSON.stringify(article.metadata, (key, value) => {
			if ((key === 'image' || key === 'icon') && typeof value === 'string') {
				const importName = importMap.get(value);
				if (importName !== undefined) {
					return importName;
				}
				const newImportId = `____IMPORT_${importId++}____`;
				importMap.set(value, newImportId);
				return newImportId;
			}
			return value;
		});
		postsContent += ',\n';
		if (article.metadata.topicIndex!== null) {
			topicIndex.push(i);
		}
		if (!article.metadata.excludeFromChildren) {
			for (const tag of article.metadata.tags) {
				const tagIndex = slugMap.get(tag);
				if (tagIndex !== undefined) {
					children[tagIndex].push(i);
				} else {
					throw new Error(`Tag '${tag}' does not exist in slugMap.`);
				}
			}
		}
		if (!article.metadata.excludeFromAll) {
			if (article.metadata.slug.includes('/')) {
				indirectChildren.push(i);
			} else {
				directChildren.push(i);
			}
		}
	}
	postsContent += '];\n';

	sortBy(articles, directChildren, e => e.metadata.date, e => e.metadata.title, e => e.metadata.slug);
	sortBy(articles, indirectChildren, e => e.metadata.date, e => e.metadata.title, e => e.metadata.slug);
	sortBy(articles, topicIndex, e => e.metadata.topicIndex, e => e.metadata.date, e => e.metadata.title, e => e.metadata.slug);
	for (const list of children) {
		sortBy(articles, list, e => e.metadata.date, e => e.metadata.title, e => e.metadata.slug);
	}

	const directChildrenContent = `const directChildren = ${JSON.stringify(directChildren)}\n`;
	const indirectChildrenContent = `const indirectChildren = ${JSON.stringify(indirectChildren)}\n`;
	const topicIndexContent = `const topicIndex = ${JSON.stringify(topicIndex)}\n`;

	let slugMapContent = 'const slugMap = {\n';
	for (const [key, value] of slugMap.entries()) {
		slugMapContent += `\t${JSON.stringify(key)}: ${value},\n`;
	}
	slugMapContent += '}\n';

	let childrenContent = 'const children = [\n';
	for (const childList of children) {
		childrenContent += `\t${JSON.stringify(childList)},\n`;
	}
	childrenContent += ']\n';

	let importContent = '';
	for (const [key, value] of importMap.entries()) {
		importContent += `import ${value} from ${JSON.stringify(key)};\n`;
		postsContent = postsContent.replaceAll(`"${value}"`, value);
	}

	for (let i = 0; i < articles.length; i++) {
		const article = articles[i];
		article.needsFeeds = children[i].length >= miniumForFeedGeneration;
	}

	return {
		type: 'file',
		contents: `/* eslint-disable */
${importContent}
${postsContent}
${childrenContent}
${slugMapContent}
${directChildrenContent}
${indirectChildrenContent}
${topicIndexContent}
const miniumForFeedGeneration = ${miniumForFeedGeneration};
export function getIdBySlug(slug) {
	const id = slugMap[slug];
	if (id === undefined) throw new Error("Slug not found: " + slug);
	return id;
}
export function getMetadata(id) {
	return posts[id];
}
export function getMetadataBySlug(slug) {
	const id = getIdBySlug(slug);
	return getMetadata(id);
}

export function getChildren(id) {
	return children[id].map(i => posts[i]);
}
export function getChildrenBySlug(slug) {
	const id = getIdBySlug(slug);
	return children[id].map(i => posts[i]);
}

export function hasFeeds(id) {
	return children[id].length >= miniumForFeedGeneration;
}
export function hasFeedsBySlug(slug) {
	const id = getIdBySlug(slug);
	return hasFeeds(id);
}

export function getDirectChildren() {
	return directChildren.map(i => posts[i]);
}
export function getIndirectChildren() {
	return indirectChildren.map(i => posts[i]);
}
export function getTopicChildren() {
	return topicIndex.map(i => posts[i]);
}
export function getAllPosts() {
	return posts;
}
`,
		file: 'content.js',
	};

}
