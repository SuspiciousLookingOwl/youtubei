const fs = require("fs");

const filename = "./docusaurus.config.js";

const removePlugins = () => {
	fs.readFile("./docusaurus.config.js", "utf-8", (_err, file) => {
		// prettier-ignore
		file = file.replace("plugins: require(\"./plugins\")", "// TEMP_PLACEHOLDER");
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		fs.writeFile(filename, file, () => {});
	});
};

const addPlugins = () => {
	fs.readFile("./docusaurus.config.js", "utf-8", (_err, file) => {
		// prettier-ignore
		file = file.replace("// TEMP_PLACEHOLDER", "plugins: require(\"./plugins\")");
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		fs.writeFile(filename, file, () => {});
	});
};

module.exports = {
	removePlugins,
	addPlugins,
};
