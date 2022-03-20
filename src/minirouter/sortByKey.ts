type BaseObject<K extends string | symbol | number> = {
	[K1 in K]: string | number;
}

export default function sortByKey<K extends string | symbol | number>(key: K, ascending  = true): (a: BaseObject<K>, b: BaseObject<K>) => 1 | 0 | -1 {
	return (a,b) => {
		if (a[key] < b[key]) return ascending ? -1 : 1;
		if (a[key] > b[key]) return ascending ? 1 : -1;
		return 0;
	};
}
