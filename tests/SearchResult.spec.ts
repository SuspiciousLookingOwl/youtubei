import "jest-extended";

import { Client, SearchManager, SearchType } from "../src";

const youtube = new Client();

describe("SearchManager", () => {
	let result: SearchManager<SearchType.ALL>;

	beforeAll(async () => {
		result = await youtube.search("foo");
	});

	it("search result should be more than 15", async () => {
		expect(result.items.length).toBeGreaterThan(15);
	});

	it("load continuation", async () => {
		const nextVideos = await result.next();
		expect(nextVideos.length).toBeGreaterThan(15);
		expect(result.items.length).toBeGreaterThan(35);
	});
});
