module.exports = [
	[
		"docusaurus-plugin-typedoc",
		{
			inputFiles: ["../src/classes"],
			mode: "file",
			tsconfig: "../tsconfig.json",
			exclude: ["**/common/**/*", "**/constants.ts"],
			excludePrivate: true,
			excludeProtected: true,
			ignoreCompilerErrors: true,
			disableSources: true,
			plugin: ["typedoc-plugin-no-inherit"],
		},
	],
	require.resolve("@cmfcmf/docusaurus-search-local"),
];
