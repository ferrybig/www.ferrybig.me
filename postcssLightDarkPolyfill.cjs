const regex = /light-dark\(([^(,]+|[^(]+\([^)]+\)),\s*([^(,]+|[^(]+\([^)]+\))\)/g;

/**
 * @type import("postcss").PluginCreator<unknown>
 */
const plugin = (/*opts = {}*/) => {
	//checkOpts(opts);
	return {
		postcssPlugin: 'postcssLightDarkPolyfill.cjs',
		Declaration(decl) {
			var replacedValues = decl.value.replaceAll(regex, 'var(--is-light-mode, $1) var(--is-dark-mode, $2)');
			if (decl.value !== replacedValues) {
				decl.cloneBefore({ value: replacedValues });
			}
		},
	};
};
plugin.postcss = true;
module.exports = plugin;
