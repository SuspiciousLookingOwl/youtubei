module.exports = [
	[
		"docusaurus-plugin-typedoc",
		{
			entryPoints: ["../src/index.ts"],
			mode: "file",
			tsconfig: "../tsconfig.json",
			exclude: ["**/common/utils/**/*", "**/constants.ts", "**/*Parser.ts"],
			excludePrivate: true,
			excludeProtected: true,
			ignoreCompilerErrors: true,
			disableSources: true,
			visibilityFilters: {
				inherited: false,
			},
			// plugin: ["typedoc-plugin-no-inherit"],
		},
	],
	require.resolve("@cmfcmf/docusaurus-search-local"),
];
