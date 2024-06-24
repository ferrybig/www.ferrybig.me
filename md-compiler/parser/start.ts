import fs, { stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import lockfile from 'proper-lockfile';
import colors from 'colors';
import transformFiles from './fileTransform.js';
import type { CompileConfig, RunningConfig } from '../types.js';
import chokidar from 'chokidar';
import { createHash } from 'node:crypto';
import { makeCache, makeNoOpCache } from '../utils/cache.js';

interface PreviouslyGeneratedFiles {
	file: string,
	hash: string
}

function printFileStatus(outputDir: string, file: string, status: 'delete' | 'update' | 'create' | 'no-change') {
	if (status === 'delete') {
		console.log(colors.red('D ' + join(outputDir, file)));
	} else if (status === 'update') {
		console.log('U ' + join(outputDir, file));
	} else if (status === 'create') {
		console.log(colors.green('C ' + join(outputDir, file)));
	} else if (status === 'no-change') {
		console.log(colors.gray('= ' + join(outputDir, file)));
	}
}

async function clean(previousGeneratedFiles: PreviouslyGeneratedFiles[], {outputDir}: Pick<RunningConfig, 'outputDir'>) {
	await Promise.all(previousGeneratedFiles.map(async ({file}) => {
		printFileStatus(outputDir, file, 'delete');
		try {
			await fs.unlink(join(outputDir, file));
		} catch (e) {
			if (!(e instanceof Error) || !('errno' in e) || !('code' in e) || e.code !== 'ENOENT') throw e;
		}
	}));
	previousGeneratedFiles.length = 0;
}

async function compile(previousGeneratedFiles: PreviouslyGeneratedFiles[], config: RunningConfig) {
	console.log('Compiling...');
	console.time('Compiled');
	const generatedFiles = await transformFiles(config);
	const newGeneratedFiles: PreviouslyGeneratedFiles[] = [];
	const promises: Promise<void>[] = [];
	let skippedFiles = 0;
	for (const file of generatedFiles) {
		const filePath = join(config.outputDir, file.file);
		const newHash = createHash('sha256').update(file.contents).digest('hex');

		newGeneratedFiles.push({
			file: file.file,
			hash: newHash,
		});

		const index = previousGeneratedFiles.findIndex(f => f.file === file.file);
		let shouldOverwrite;
		if (index >= 0) {
			const [entry] = previousGeneratedFiles.splice(index, 1);
			if (entry.hash === newHash) {
				shouldOverwrite = false;
				//printFileStatus(config.outputDir, file.file, 'no-change');
				skippedFiles++;
			} else {
				shouldOverwrite = true;
				printFileStatus(config.outputDir, file.file, 'update');
			}
		} else {
			if (await stat(filePath).then(() => true, () => false)) {
				throw new Error(`File ${file.file} already exists, refusing to overwriting`);
			} else {
				shouldOverwrite = true;
				printFileStatus(config.outputDir, file.file, 'create');
			}
		}
		if (shouldOverwrite) {
			promises.push((async () => {
				await fs.mkdir(dirname(filePath), { recursive: true });
				await fs.writeFile(filePath, file.contents);
			})());
		}
	}
	await Promise.all(promises);
	console.log(colors.gray(skippedFiles + ' files skipped as no update was needed'));
	await clean(previousGeneratedFiles, config);
	previousGeneratedFiles.push(...newGeneratedFiles);
	console.timeEnd('Compiled');
}

function setupWatcher({ inputDir }: Pick<RunningConfig, 'inputDir'>) {
	const watcher = chokidar.watch(join(inputDir, '**', '*.md'), {
		persistent: true,
		ignoreInitial: true,
		alwaysStat: false,
	});
	let trigger: {
		resolve(status: boolean): void,
		reject(e: unknown): void
	};
	let promise: Promise<boolean>;
	function reset(input: boolean = false) {
		promise = new Promise<boolean>((resolve, reject) => trigger = {resolve, reject});
		return input;
	}
	reset();
	watcher.on('change', () => trigger.resolve(true));
	watcher.on('unlink', () => trigger.resolve(true));
	watcher.on('add', () => trigger.resolve(true));
	watcher.on('error', (error) => {
		trigger.reject(error);
	});
	return {
		await: () => promise.then(reset),
		close: async () => {
			trigger.resolve(false);
			await watcher.close();
		},
	};
}

async function markdownCompiler({ doClean, doCompile, doWatch, ...config }: CompileConfig) {
	const previousGeneratedFiles: PreviouslyGeneratedFiles[] = [];

	await fs.mkdir(config.outputDir, { recursive: true });

	const release = await lockfile.lock(config.outputDir);
	try {
		try {
			const content = await fs.readFile(join(config.outputDir, 'generated_files.txt'), { encoding: 'utf8' });
			for (const line of content.split('\n')) {
				if (!line.startsWith('#') && line.length !== 0) {
					const [,,hash, file] = line.split(' ', 4);
					previousGeneratedFiles.push({
						file,
						hash,
					});
				}
			}
		} catch (e) {
			if (!(e instanceof Error) || !('errno' in e) || !('code' in e) || e.code !== 'ENOENT') throw e;
		}

		if (doClean && previousGeneratedFiles.length > 0) {
			await clean(previousGeneratedFiles, config);
			await fs.unlink(join(config.outputDir, '.gitignore'));
		}

		if (doCompile) {
			const watcher = doWatch ? setupWatcher(config) : null;
			const cache = doWatch ? makeCache() : makeNoOpCache();
			const runningConfig: RunningConfig = {
				...config,
				cache,
			};
			try {
				do {
					cache.nextCycle();
					await compile(previousGeneratedFiles, runningConfig);
					const newGitIgnore = '# This is an generated file\n' + previousGeneratedFiles.map(e => `  ${e.hash} ${e.file}`).join('\n');
					await fs.writeFile(join(config.outputDir, 'generated_files.txt'), newGitIgnore);
				} while (await watcher?.await());
			} finally {
				await watcher?.close();
			}
		}
	} finally {
		await release();
	}
}

export default markdownCompiler;
