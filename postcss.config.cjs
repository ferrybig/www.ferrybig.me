

module.exports = {
	plugins: [
		[
			'postcss-preset-env',
			{
				autoprefixer: {
					flexbox: 'no-2009',
				},
				stage: 3,
				features: {
					'custom-properties': false,
					'light-dark-function': false,
				},
			},
		],
		'./postcssLightDarkPolyfill.cjs',
		'postcss-combine-media-query',
	],
};
