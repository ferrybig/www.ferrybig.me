#!/usr/bin/env node
const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');
var nodeExternals = require('webpack-node-externals');
var browserSync = require('browser-sync');
const md5 = require('md5');
const hljs = require('highlight.js');

function main(watchMode = false) {
	return new Promise((doResolve, doReject) => {
		const assets = {};
		const compiler = webpack({
			entry: './src/index.ts',
			output: {
				path: path.resolve(__dirname, 'tmp'),
				filename: 'bundle.js',
				libraryTarget: 'umd',
				publicPath: "/",
				assetModuleFilename: 'static/[hash][ext][query]',
			},
			target: 'node', // use require() & use NodeJs CommonJS style
			externals: [nodeExternals({ allowlist: ['highlight.js/styles/github.css']})], // in order to ignore all modules in node_modules folder
			externalsPresets: {
				node: true // in order to ignore built-in modules like path, fs, etc. 
			},
			node: false,
			mode: 'development',
			devtool: 'cheap-source-map',
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [
							{
								loader: 'style-loader',
								options: {
									esModule: false
								}
							},
							{
								loader: 'css-loader',
								options: {
									importLoaders: 1,
									sourceMap: true,
									esModule: false
								}
							}
						]
					},
					{
						test: /\.ts(x)?$/,
						loader: 'ts-loader',
						exclude: /node_modules/
					},
					{
						test: /\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2)$/i,
						type: 'asset'
					},
					{
						test: /\.md$/,
						use: [
							{
								loader: 'json-tagged-file-loader',
								options: {
									destructure: true,
									defaultExportName: 'code',
									inputEsModule: false,
									outputEsModule: true,
									extras: {
										title: 'detect-title-html',
									},
									schema: {
										type: 'object',
										properties: {
											"date": {
												"type": "string",
												"format": "date"
											},
											"endDate": {
												"type": ["string", "null"],
												"format": "date",
											},
											"parent": {
												"type": "string"
											},
											"tags": {
												"type": "array",
												"items": {
													"type": "string"
												},
												"minItems": 1,
												"uniqueItems": true
											},
											"extraTags": {
												"type": "array",
												"items": {
													"type": "string"
												},
												"uniqueItems": true
											},
										},
										required: ["date", "tags", "extraTags"],
										additionalProperties: false,
									},
									loaders: [
										{
											loader: "html-loader",
											options: {
												minimize: true,
												esModule: false,
											},
										},
										{
											loader: "markdown-loader",
											options: {
												highlight: function(code, lang) {
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
			resolve: {
				extensions: [
					'.tsx',
					'.ts',
					'.js'
				],
				mainFiles: ['index', 'index.md'],
			},
			plugins: [
				new webpack.WatchIgnorePlugin({
					paths: [/css\.d\.ts$/]
				}),
			]
		});
		function reject(e) {
			compiler.close((closeErr) => {
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
					watching.close((err1) => {
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
								extensions: ["html"],
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
			console.log(stats.toString(stats.hasErrors() ? 'errors-only' : "errors-warnings"));
			try {
				if (stats.hasErrors()) {
					const error = stats.toString('errors-only');
					if (!watching) return reject("Errors during compiling! " + error);
					bs?.notify(error);
					return;
				}
				if (stats.hasWarnings()) {
					bs?.notify(stats.toString('errors-warnings'));
				}
				fs.copySync('./tmp', './dist', { filter: (name) => !name.endsWith('bundle.js') && !name.endsWith('bundle.js.map') });
				delete require.cache[require.resolve("./tmp/bundle.js")];
				require("./tmp/bundle.js").default(assets);
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
			}
		})))
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

main(true).then(() => { }, (e) => {
	console.error(e);
	process.exit(1);
});
