/* eslint-disable @typescript-eslint/no-var-requires */
/* global require, __dirname, module */
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const hljs = require('highlight.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { noopener: noOpener } = require('posthtml-noopener');
const sharp = require('responsive-loader/sharp');
const CopyPlugin = require('copy-webpack-plugin');

const output = {
	path: path.resolve(__dirname, 'dist'),
	filename: '[name].js',
	libraryTarget: 'umd',
	publicPath: '/',
	assetModuleFilename: 'static/[contenthash][ext][query]',
};

module.exports = [
	{
		entry: {
			'INTERNAL-browser': './src/embedded-js/index.ts',
		},
		output: { ...output },
		target: 'web',
		mode: 'production',
		devtool: false,
		plugins: [
			new webpack.SourceMapDevToolPlugin({
				append: '\n//# sourceMappingURL=../[url]',
				filename: 'static/[contenthash:20].map',
			})
		],
		module: {
			rules: [
				{
					test: /\.ts(x)?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
				},
			]
		}
	},
	{
		entry: {
			'INTERNAL-bundle': './src/index.ts',
		},
		output: { ...output },
		target: 'node',
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
			new CopyPlugin({
				patterns: [
					{ from: 'public', to: '.' },
				],
			}),
		],
		resolve: {
			extensions: [
				'.tsx',
				'.ts',
				'.js'
			],
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
						},
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										[
											'postcss-preset-env',
											{
												// Options
											},
										],
									],
								},
							},
						},
					]
				},
				{
					test: /\.ts(x)?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /INTERNAL-browser\.js$/,
					exclude: /node_modules/,
					type: 'asset/resource',
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
					test: /\.(jpe?g|png|webp)$/i,
					resourceQuery: /&useResponsiveLoader=true$/,
					use: {
						loader: 'responsive-loader',
						options: {
							adapter: sharp,
							name: '[contenthash:20].[ext]', // todo check if we need `.[width]` in this line
							outputPath: 'static',
						},
					},
					type: 'javascript/auto',
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
																node.attrs.download = href.substring(href.lastIndexOf('/') + 1, href.length);
															}

															return node;
														}
													);
												},
												(tree) => {
													//const promises = [];
													tree.match(
														{
															tag: 'img',
															attrs: { src: new RegExp(/\S+/) },
														},
														(node) => {
															const { src } = node.attrs;
															if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
																return node;
															}

															return node;
														}
													);
													//return Promise.all(promises);
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
	},
];
