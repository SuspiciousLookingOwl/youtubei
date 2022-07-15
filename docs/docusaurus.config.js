module.exports = {
	title: "Youtubei",
	tagline: "Get Youtube Data",
	url: "https://github.com/SuspiciousLookingOwl/youtubei",
	baseUrl: "/youtubei/",
	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/favicon.ico",
	organizationName: "SuspiciousLookingOwl", // Usually your GitHub org/user name.
	projectName: "youtubei", // Usually your repo name.
	themeConfig: {
		colorMode: {
			defaultMode: "dark",
		},
		navbar: {
			title: "Youtubei",
			items: [
				{
					to: "docs/",
					activeBasePath: "docs",
					label: "Docs",
					position: "left",
				},
				{
					href: "https://github.com/SuspiciousLookingOwl/youtubei",
					label: "Source",
					position: "left",
				},
				{
					href: "http://npmjs.com/package/youtubei",
					label: "NPM",
					position: "left",
				},
			],
		},
		footer: {
			style: "dark",
			copyright: `Copyright © ${new Date().getFullYear()}`,
		},
	},
	presets: [
		[
			"@docusaurus/preset-classic",
			{
				docs: {
					sidebarPath: require.resolve("./sidebars.js"),
				},
				theme: {
					customCss: require.resolve("./src/css/custom.css"),
				},
			},
		],
	],
	plugins: require("./plugins"),
};
