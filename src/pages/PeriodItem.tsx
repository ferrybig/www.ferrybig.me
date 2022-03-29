import { DateTime } from 'luxon';
import Feed from '../components/Feed';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import {byPeriod} from '.';
import Link from '../components/Link';
import classes from './PeriodItem.module.css';

interface PaginationProps {
	year: number,
	month: number,
	all: {
		content: ContentDefinition[],
		year: number,
		month: number,
	}[]
}

function Pagination({ year, month: currentMonth, all }: PaginationProps) {
	const months = [];
	for(let month = 1; month <= 12; month++) {
		const text = DateTime.fromObject({ month }).toLocaleString({ month: 'short'});
		const found = all.filter(e => e.year === year && e.month === month).length;
		months.push(found ? (
			<Link
				route={byPeriod}
				props={{ month, year }}
				aria-current={month === currentMonth ? 'page' : undefined}
				title={`${found} article${found > 1 ? 's' : ''}`}
			>
				{text}
			</Link>
		) : (
			<span>
				{text}
			</span>
		));
		if (month != 12) {
			months.push(' ');
		}
	}
	return (
		<li className={classes.pagination}>
			<p>{year}</p>
			<p>{months}</p>
		</li>
	);
}

interface Props {
	base: PageBase,
	content: ContentDefinition[],
	year: string,
	month: string,
	count: number
	all: {
		content: ContentDefinition[],
		year: number,
		month: number,
	}[]
}

export default function PeriodItem({ base, year: yearString, month: monthString, content, all, count }: Props) {
	const year = Number(yearString);
	const month = Number(monthString);
	const last = all[0];
	const first = all[all.length - 1];
	const currentIndex = all.findIndex(e => e.year === year && e.month === month);
	const previous = currentIndex >= 0 && currentIndex - 1 < all.length ? all[currentIndex + 1] : null;
	const next = currentIndex + 1 >= 0 && currentIndex  < all.length ? all[currentIndex - 1] : null;
	return (
		<Feed
			base={base}
			title={`All posts from ${DateTime.fromObject({
				year: Number(year),
				month: Number(month),
			}).toLocaleString({
				year: 'numeric',
				month: 'long',
			})}`}
			page={1}
			pages={1}
			pagination={() => <Pagination year={year} all={all} month={month}/>}
			slice={content}
			toPath={() => ''}
			count={count}
			first={byPeriod.toPath({ month: first.month, year: first.year })}
			last={byPeriod.toPath({ month: last.month, year: last.year })}
			next={next ? byPeriod.toPath({ month: next.month, year: next.year }) : null}
			previous={previous ? byPeriod.toPath({ month: previous.month, year: previous.year }) : null}
		/>
	);
}
