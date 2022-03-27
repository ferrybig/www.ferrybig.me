#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* global require, process */
const webpack = require('webpack');
const fs = require('fs-extra');
const browserSync = require('browser-sync');
const md5 = require('md5');
const webpackConfig = require('./webpack.config');

function main(watchMode = false) {
	return new Promise((doResolve, doReject) => {
		const assets = {};
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
						open: false,
						online: false,
						startPath: '/sitemap',
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
				fs.copySync('./tmp', './dist', { filter: (name) => !name.endsWith('bundle.js') && !name.endsWith('bundle.js.map') });
				const newAssets = {
					...assets,
				};
				//console.log(stats.toJson('all').chunks);
				for (const asset of stats.toJson('all').assets) {
					if (asset.name.startsWith('static/')) {
						newAssets[asset.name] = asset.name;
						console.log(`${`dist/${asset.name}:`.padEnd(40)} ${asset.size}\t bytes emitted (from: ${asset.info.sourceFilename})${asset.isOverSizeLimit ? ' OVERSIZED' : ''}`);
					}
				}
				delete require.cache[require.resolve('./tmp/bundle.js')];
				require('./tmp/bundle.js').default(newAssets);
				console.log('Done!');
				bs?.reload();
				if (!watching) return resolve();
			} catch (e) {
				console.error(e);
				bs?.notify(e);
				if (!watching) return reject(e);
			}
		};
		const readAssetsPromise = fs.readdir('./public').then(l => Promise.all(l.map(async f => {
			const s = await fs.lstat('./public/' + f);
			if (s.isFile()) {
				const fileContents = await fs.readFile('./public/' + f);
				assets[f] = `${f}?v=${md5(fileContents).substring(0, 20)}`;
				console.log(`${`dist/${f}:`.padEnd(40)} ${fileContents.length}\t bytes copied`);
			}
		})));
		const clean = false;
		Promise.resolve()
			.then(() => clean && Promise.all(fs.rm('./tmp', { recursive: true, force: true }), fs.rm('./dist', { recursive: true, force: true })))
			.then(() => fs.copy('./public', './dist'))
			.then(() => readAssetsPromise)
			.then(() => {
				if (watchMode) {
					watching = compiler.watch({
						aggregateTimeout: 300,
						poll: undefined
					}, onResult);
				} else {
					compiler.run(onResult);
				}
			})
			.catch(e => doReject(e));
	});
}

main(true).then(() => {
	console.log('success');
}, (e) => {
	console.error(e);
	process.exit(1);
});
