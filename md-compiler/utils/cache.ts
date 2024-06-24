export type CacheFile =
| {
	readonly file: string;
	readonly modificationTime: number;
}
| {
	readonly contents: string;
}
function compareCacheFile(a: CacheFile, b: CacheFile): boolean {
	if ('file' in a) {
		if ('file' in b) return a.file === b.file && a.modificationTime === b.modificationTime;
		return false;
	}
	if ('file' in b) return false;
	return a.contents === b.contents;

}
function compareCacheFileArray(a: CacheFile[], b: CacheFile[]) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (!compareCacheFile(a[i], b[i])) return false;
	}
	return true;
}
export interface Cache {
	nextCycle(): void;
	memo<R>(factory: () => R, key: symbol, deps: CacheFile[]): Promise<Awaited<R>>;
}
export function makeCache(): Cache {
	let cache: {
		key: symbol
		deps: any;
		result: any;
	}[] = [];
	let oldCache: typeof cache = [];
	return {
		nextCycle() {
			oldCache = cache;
			cache = [];
		},
		async memo(factory, key, deps) {
			for (const entry of cache) {
				if (entry.key === key && (entry.deps === deps || compareCacheFileArray(entry.deps, deps))) return entry.result;
			}
			for (const entry of oldCache) {
				if (entry.key === key && (entry.deps === deps || compareCacheFileArray(entry.deps, deps))) {
					cache.push(entry);
					return entry.result;
				}
			}
			const result = await factory();
			cache.push({key, deps, result});
			return result;
		},
	};
}
export function makeNoOpCache(): Cache {
	return {
		nextCycle() {},
		memo(factory) {
			return Promise.resolve(factory());
		},
	};
}
