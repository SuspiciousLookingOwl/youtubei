module.exports = {
	env: {
		es2021: true,
		node: true,
		jest: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "prettier"],
	rules: {
		"linebreak-style": ["error", "unix"],
		"no-mixed-spaces-and-tabs": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-namespace": "off",
		indent: ["off", "tab"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
