#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* global require, process */
const webpack = require('webpack');
const fs = require('fs-extra');
const browserSync = require('browser-sync');
const webpackConfig = require('./webpack.config');
const yargs = require('yargs');
const package = require('./package.json');

function closeAll(compilers) {
	return Promise.allSettled(compilers.map(c => new Promise((resolve, reject) => c.close((err) => err ? reject(err) : resolve()))));
}

/**
 *
 * @param {webpack.Compiler[]} compilers
 * @param {boolean} watch
 * @param {(err: Error, stats: webpack.Stats[]) => void} onResult
 */
function startCompilation(compilers, watch, onResult) {
	const results = compilers.map(() => [null, null]);
	let startIndex = -1;
	function startNext() {
		const myIndex = ++startIndex;
		const newOnResult = (e, s) => {
			results[myIndex] = [e, s];
			if (!results.find(([err, stats]) => err === null && stats === null)) {
				const error = results.find(([err]) => !!err)?.[0];
				if(error) {
					onResult(error, []);
				} else {
					onResult(null, results.map(i => i[1]));
				}
			} else {
				if (startIndex === myIndex) {
					startNext();
				}
			}
		};
		const compiler = compilers[myIndex];
		if (watch) {
			compiler.watch({
				aggregateTimeout: 300,
				poll: undefined
			}, newOnResult);
		} else {
			compiler.run(newOnResult);
		}
	}
	startNext();
}

function main({ clean, watch, open, port }) {
	return new Promise((doResolve, doReject) => {
		const assets = {};
		webpackConfig[0].output.clean = clean;
		const compilers = webpackConfig.map(c => webpack(c));
		function reject(e) {
			closeAll(compilers).then(() => doReject(e), doReject);
		}
		function resolve() {
			closeAll(compilers).then(doResolve, doReject);
		}
		let bs = null;
		startCompilation(compilers, watch, (err, stats) => {
			if (err) {
				bs?.close();
				reject(err instanceof Error ? err : new Error(err));
				return;
			}
			if (watch) {
				if (bs === null) {
					bs = browserSync.create();
					bs.init({
						server: {
							baseDir: 'dist',
							serveStaticOptions: {
								extensions: ['html'],
							},
						},
						open,
						online: false,
						startPath: '/sitemap',
						port,
					});
				} else {
					console.log('-----------------------------------------------------------');
				}
			}
			// Print watch/build result here...
			for(const stat of stats) {
				console.log(stat.toString(stat.hasErrors() ? 'errors-only' : 'errors-warnings'));
			}
			try {
				for(const stat of stats) {
					if (stat.hasErrors()) {
						const error = stat.toString('errors-only');
						if (!watch) return reject('Errors during compiling! ' + error);
						bs?.notify(error);
						return;
					}
					if (stat.hasWarnings()) {
						bs?.notify(stat.toString('errors-warnings'));
					}
				}
				const newAssets = {
					...assets,
				};
				//console.log(stats.toJson('all').chunks);
				for(const stat of stats) {
					for (const asset of stat.toJson('all').assets) {
						// if (asset.name.startsWith('static/')) {
						newAssets[asset.info.sourceFilename ?? `output:${asset.name}`] = asset.name;
						console.log(`${`dist/${asset.name}:`.padEnd(40)} ${asset.size}\t bytes emitted (from: ${asset.info.sourceFilename})${asset.isOverSizeLimit ? ' OVERSIZED' : ''}`);
						// }
					}
				}
				const module = `./dist/${webpackConfig[1].output.filename.replace('[name]', 'INTERNAL-bundle')}`;
				delete require.cache[require.resolve(module)];
				require(module).default(newAssets);
				console.log('Done!');
				bs?.reload();
				if (!watch) return resolve();
			} catch (e) {
				console.error(e);
				bs?.notify(e);
				if (!watch) return reject(e);
			}
		});
	});
}

const argv = yargs(process.argv.slice(2))
	.usage('Usage: $0 [options]')
	.option('clean', {
		description: 'Clean fils before build',
		alias: 'c',
		type: 'boolean',
	})
	.option('watch', {
		alias: 'w',
		description: 'Watch the folder',
		type: 'boolean',
	})
	.option('port', {
		alias: 'p',
		description: 'The HTTP server port used to serve the files in watch mode',
		type: 'number'
	})
	.implies('port', 'watch')
	.option('open', {
		alias: 'o',
		description: 'Opens the http server once the app starts',
		type: 'boolean'
	})
	.implies('open', 'watch')
	.help()
	.version('version', 'display version information', package.version)
	.alias('version', 'v')
	.showHelpOnFail(false, 'whoops, something went wrong! run with --help')
	.argv;
console.log(argv);
main({
	clean: !!argv.clean,
	watch: !!argv.watch,
	open: !!argv.open,
	port: argv.port ?? 3010,
}).then(() => Promise.all([
	fs.rm(`./dist/${webpackConfig[0].output.filename.replace('[name]', Object.keys(webpackConfig[0].entry)[0])}`),
	fs.rm(`./dist/${webpackConfig[1].output.filename.replace('[name]', Object.keys(webpackConfig[1].entry)[0])}`,),
	fs.rm(`./dist/${webpackConfig[1].output.filename.replace('[name]', Object.keys(webpackConfig[1].entry)[0])}.map`,)
])).then(() => {
	console.log('Finished building!');
}).catch((e) => {
	console.error(e);
	process.exit(1);
});
