import "jest-extended";

import { Client, SearchResult } from "../../src";

const youtube = new Client();

describe("SearchResult", () => {
	let result: SearchResult;

	beforeAll(async () => {
		result = await youtube.search("foo");
	});

	it("search result should be more than 15", async () => {
		expect(result.items.length).toBeGreaterThan(15);
	});

	it("load continuation", async () => {
		const nextVideos = await result.next();
		expect(nextVideos.length).toBeGreaterThan(15);
		expect(result.items.length).toBeGreaterThanOrEqual(35);
	});
});
