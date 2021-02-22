/**
 * Dirty & temporary workaround to format generated MD file in ./docs/api/classes
 *
 * This will removes Hierarchy and Implements section
 */

const fs = require("fs");

const excludedHierarchy = ["searchresult.md", "thumbnails.md"];

const files = fs.readdirSync("./docs/api/classes");

for (const fileName of files) {
	fs.readFile(`./docs/api/classes/${fileName}`, "utf-8", (_err, file) => {
		if (!excludedHierarchy.includes(fileName)) file = file.replace(/## Hierarchy.*?##/s, "##");
		file = file.replace(/## Implements.*?##/s, "##");
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		fs.writeFile(`./docs/api/classes/${fileName}`, file, () => {});
	});
}
