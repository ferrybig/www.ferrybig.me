export interface TableOfContentsEntry {
	title: string,
	slug: string,
	lvl: number,
}
export interface Post {
	type: 'post',
	slug: string,
	childPath: string | null,
	mainTag: Tag,
	tags: Tag[],
	markdown: string
	/** The exact file name from the root of the repo */
	filename: string
	hiddenFromTags: boolean,
	hiddenFromAll: boolean,
	date: string | null,
	title: string,
	deprecated: boolean,
	updatedAt: string,
	tableOfContents: TableOfContentsEntry[],
	readingTimeMin: number,
	readingTimeMax: number,
	thumbnail: {
		alt: string | null,
		link: string | null,
		width: number | null,
		height: number | null,
		image: string
		embed: 'iframe' | null,
	} | null
}

export interface Tag {
	type: 'tag',
	minDate: string | null,
	maxDate: string | null,
	slug: string,
	layout: 'card' | 'list' | 'simple' | 'none'
	posts: Post[]
	hidden: boolean,
	markdown: string,
	filename: string
	title: string,
	topicIndex: number,
}

export interface Content {
	rawPosts: Post[],
	posts: Post[],
	rawTags: Tag[],
	tags: Tag[],
}
