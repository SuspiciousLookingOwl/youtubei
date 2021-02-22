const typedocSidebar = require("./typedoc-sidebar.js");

module.exports = {
	sidebar: {
		General: ["quickstart"],
		Classes: typedocSidebar.find((t) => t.label === "Classes").items,
		Other: ["api/index"],
	},
};
