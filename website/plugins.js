module.exports = [
	[
		"docusaurus-plugin-typedoc",
		{
			entryPoints: ["../src/classes/"],
			mode: "file",
			tsconfig: "../tsconfig.json",
			excludePrivate: true,
			excludeProtected: true,
			ignoreCompilerErrors: true,
			disableSources: true,
			plugin: ["typedoc-plugin-no-inherit"],
		},
	],
	require.resolve("@cmfcmf/docusaurus-search-local"),
];
