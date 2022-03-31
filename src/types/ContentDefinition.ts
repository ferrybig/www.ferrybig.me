import { DateTime } from 'luxon';

interface ContentDefinition {
	body: string,
	title: string,
	summary: string,
	summaryXml: string,
	summaryIsShorterThanBody: boolean,
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
