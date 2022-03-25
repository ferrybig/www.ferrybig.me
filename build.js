#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');
const nodeExternals = require('webpack-node-externals');
const browserSync = require('browser-sync');
const md5 = require('md5');
const hljs = require('highlight.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const {noopener: noOpener} = require('posthtml-noopener');

function main(watchMode = false) {
	return new Promise((doResolve, doReject) => {
		const assets = {};
		const compiler = webpack({
			entry: './src/index.ts',
			output: {
				path: path.resolve(__dirname, 'tmp'),
				filename: 'bundle.js',
				libraryTarget: 'umd',
				publicPath: '/',
				assetModuleFilename: 'static/[contenthash][ext][query]',
			},
			target: 'node', // use require() & use NodeJs CommonJS style
			externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
			externalsPresets: {
				node: true // in order to ignore built-in modules like path, fs, etc.
			},
			node: false,
			mode: 'development',
			devtool: 'source-map',
			optimization: {
				minimize: true,
				minimizer: [
					new CssMinimizerPlugin({
						minimizerOptions: {
							preset: [
								'cssnano-preset-advanced',
								{
									discardComments: { removeAll: true },
								},
							],
						},
					}),
					new ImageMinimizerPlugin({
						minimizer: {
							implementation: ImageMinimizerPlugin.imageminMinify,
							options: {
								// Lossless optimization with custom option
								// Feel free to experiment with options for better result for you
								plugins: [
									['gifsicle', { interlaced: true }],
									['jpegtran', { progressive: true }],
									['optipng', { optimizationLevel: 5 }],
									// Svgo configuration here https://github.com/svg/svgo#configuration
									[
										'svgo',
										{},
									],
								],
							},
						},
					}),
				],
				splitChunks: {
					cacheGroups: {
						styles: {
							name: 'styles',
							type: 'css/mini-extract',
							chunks: 'all',
							enforce: true,
						},
					},
				},
			},
			plugins: [
				new MiniCssExtractPlugin({
					filename: 'static/[contenthash].css',
				}),
			],
			resolve: {
				extensions: [
					'.tsx',
					'.ts',
					'.js'
				],
				mainFiles: ['index', 'index.md'],
			},
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: 'css-loader',
								options: {
									importLoaders: 1,
									sourceMap: true,
									esModule: false,
								}
							}
						]
					},
					{
						test: /\.ts(x)?$/,
						loader: 'ts-loader',
						exclude: /node_modules/,
					},
					{
						test: /\.content.js?$/,
						exclude: /node_modules/,
						type: 'asset/resource',
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								minified: true,
								inputSourceMap: false,
								sourceMaps: 'inline',
								comments: false,
							},
						},
					},
					{
						test: /\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2|zip|jar|tar|stl)$/i,
						type: 'asset',
					},
					{
						test: /favicon.*\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2|zip|jar|tar|stl)$/i,
						type: 'asset/resource',
					},
					{
						test: /\.md$/,
						use: [
							{
								loader: path.resolve('./git-annotate-loader.cjs'),
							},
							{
								loader: 'json-tagged-file-loader',
								options: {
									destructure: true,
									defaultExportName: 'code',
									inputEsModule: false,
									outputEsModule: true,
									extras: {
										thumbnail: 'require'
									},
									schema: {
										type: 'object',
										properties: {
											'date': {
												'type': 'string',
												'format': 'date'
											},
											'endDate': {
												'type': ['string', 'null'],
												'format': 'date',
											},
											'parent': {
												'type': 'string'
											},
											'thumbnail': {
												'type': 'string'
											},
											'tags': {
												'type': 'array',
												'items': {
													'type': 'string'
												},
												'minItems': 1,
												'uniqueItems': true
											},
											'extraTags': {
												'type': 'array',
												'items': {
													'type': 'string'
												},
												'uniqueItems': true
											},
										},
										required: ['date', 'tags', 'extraTags'],
										additionalProperties: false,
									},
									loaders: [
										{
											loader: 'html-loader',
											options: {
												minimize: true,
												esModule: false,
												sources: {
													list: [
														'...',
														{
															tag: 'a',
															attribute: 'href',
															type: 'src',
															filter: (tag, attribute, attributes) => {
																const attributeInstance = attributes.find(a => a.name === 'href');
																if (!attributeInstance) {
																	return false;
																}
																return attributeInstance.value
																	&& attributes.find(a => a.name === 'download')
																	&& attributeInstance.value.startsWith('.')
																	|| false;
															}
														},
													],
												},
											},
										},
										{
											loader: 'posthtml-loader',
											options: {
												plugins: [
													noOpener(),
													(tree) => {
														tree.match(
															{
																tag: 'a',
																attrs: { href: new RegExp(/\S+/), download: '' },
															},
															(node) => {
																const { download, href } = node.attrs;

																if (!download) {
																	node.attrs.download = href.substring(href.lastIndexOf('/')+ 1, href.length);
																}

																return node;
															}
														);
													}
												]
											}
										},
										{
											loader: 'markdown-loader',
											options: {
												highlight: function (code, lang) {
													const language = hljs.getLanguage(lang) ? lang : 'plaintext';
													return hljs.highlight(code, { language }).value;
												},
												langPrefix: 'hljs language-',
												headerPrefix: 'content-',
											},
										},
									],
								}
							},
						],
					},
				]
			},
		});
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
