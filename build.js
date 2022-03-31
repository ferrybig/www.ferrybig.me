#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* global require, process */
const webpack = require('webpack');
const fs = require('fs-extra');
const browserSync = require('browser-sync');
const webpackConfig = require('./webpack.config');
const yargs = require('yargs');
const package = require('./package.json');

function main({ clean, watch, open, port }) {
	return new Promise((doResolve, doReject) => {
		const assets = {};
		webpackConfig.output.clean = clean;
		const compiler = webpack(webpackConfig);
		function reject(e) {
			compiler.close(() => {
				doReject(e);
			});
		}
		function resolve() {
			compiler.close((closeErr) => {
				if (closeErr) {
					return doReject(closeErr);
				}
				doResolve();
			});
		}
		let watching = null;
		let bs = null;
		const onResult = (err, stats) => { // [Stats Object](#stats-object)
			if (err) {
				bs?.close();
				if (watching) {
					watching.close(() => {
						reject(err instanceof Error ? err : new Error(err));
					});
				} else {
					reject(err instanceof Error ? err : new Error(err));
				}
			}
			if (watching) {
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
			console.log(stats.toString(stats.hasErrors() ? 'errors-only' : 'errors-warnings'));
			try {
				if (stats.hasErrors()) {
					const error = stats.toString('errors-only');
					if (!watching) return reject('Errors during compiling! ' + error);
					bs?.notify(error);
					return;
				}
				if (stats.hasWarnings()) {
					bs?.notify(stats.toString('errors-warnings'));
				}
				const newAssets = {
					...assets,
				};
				//console.log(stats.toJson('all').chunks);
				for (const asset of stats.toJson('all').assets) {
					// if (asset.name.startsWith('static/')) {
					newAssets[asset.info.sourceFilename ?? `output:${asset.name}`] = asset.name;
					console.log(`${`dist/${asset.name}:`.padEnd(40)} ${asset.size}\t bytes emitted (from: ${asset.info.sourceFilename})${asset.isOverSizeLimit ? ' OVERSIZED' : ''}`);
					// }
				}
				delete require.cache[require.resolve(`./dist/${webpackConfig.output.filename}`)];
				require(`./dist/${webpackConfig.output.filename}`).default(newAssets);
				console.log('Done!');
				bs?.reload();
				if (!watching) return resolve();
			} catch (e) {
				console.error(e);
				bs?.notify(e);
				if (!watching) return reject(e);
			}
		};
		if (watch) {
			watching = compiler.watch({
				aggregateTimeout: 300,
				poll: undefined
			}, onResult);
		} else {
			compiler.run(onResult);
		}
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
	port: argv.port ?? 3000,
}).then(() => Promise.all([
	fs.rm(`./dist/${webpackConfig.output.filename}`),
	fs.rm(`./dist/${webpackConfig.output.filename}.map`,)
])).then(() => {
	console.log('Finished building!');
}).catch((e) => {
	console.error(e);
	process.exit(1);
});
