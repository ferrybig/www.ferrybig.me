import { DateTime } from "luxon";

type BaseObject<K extends string | symbol | number> = {
	[K1 in K]: string | number | DateTime;
}

export default function sortByKey<K extends string | symbol | number, P = unknown>(
	key: K,
	ascending = true,
	parent: (a: P, b: P) => number = () => 0
): (a: P & BaseObject<K>, b: P & BaseObject<K>) => number {
	return (a, b) => {
		if (a[key] < b[key]) return ascending ? -1 : 1;
		if (a[key] > b[key]) return ascending ? 1 : -1;
		return parent(a, b);
	};
}
