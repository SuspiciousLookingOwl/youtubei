module.exports = [
	[
		"docusaurus-plugin-typedoc",
		{
			id: "youtube",
			out: "youtube",
			entryPoints: ["../src/index.ts"],
			mode: "file",
			tsconfig: "../tsconfig.json",
			exclude: [
				"**/src/music/**/*",
				"**/common/utils/**/*",
				"**/constants.ts",
				"**/*Parser.ts",
			],
			excludePrivate: true,
			excludeProtected: true,
			ignoreCompilerErrors: true,
			disableSources: true,
			plugin: ["typedoc-plugin-no-inherit"],
		},
	],
	[
		"docusaurus-plugin-typedoc",
		{
			id: "music",
			out: "music",
			entryPoints: ["../src/index.ts"],
			mode: "file",
			tsconfig: "../tsconfig.json",
			exclude: [
				"**/src/youtube/**/*",
				"**/common/utils/**/*",
				"**/constants.ts",
				"**/*Parser.ts",
			],
			excludePrivate: true,
			excludeProtected: true,
			ignoreCompilerErrors: true,
			disableSources: true,
			plugin: ["typedoc-plugin-no-inherit"],
		},
	],
	require.resolve("@cmfcmf/docusaurus-search-local"),
];
