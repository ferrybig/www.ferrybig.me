import { DateTime } from 'luxon';

interface ContentDefinition {
	body: string,
	title: string,
	summary: string,
	date: DateTime
	created: DateTime
	updated: DateTime
	endDate: DateTime | null,
	slug: string
	tags: string[]
	extraTags: string[]
	hidden: boolean
}

export default ContentDefinition;
