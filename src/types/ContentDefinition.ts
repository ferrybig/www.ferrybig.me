import * as md from '*.md'

interface ContentDefinition {
	body: string,
	title: string,
	titleHTML: string,
	date: string
	created: string
	updated: string
	endDate: string | null,
	slug: string
	tags: string[]
	extraTags: string[]
	hidden: boolean
};

export default ContentDefinition;
