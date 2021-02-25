const typedocSidebar = require("./typedoc-sidebar.js");

module.exports = {
	sidebar: {
		General: ["quickstart", "snippets-faq"],
		Classes: typedocSidebar.find((t) => t.label === "Classes").items,
		Other: ["api/index", "api/globals"],
	},
};
