import { Client, SearchResult } from "../dist";
import "jest-extended";

const youtube = new Client();

describe("SearchResult", () => {
	let searchResult: SearchResult<{ type: "all" }>;

	beforeAll(async () => {
		searchResult = await youtube.search("foo");
	});

	it("search result should be more than 15", async () => {
		expect(searchResult.length).toBeGreaterThan(15);
	});

	it("load continuation", async () => {
		const nextVideos = await searchResult.next();
		expect(nextVideos.length).toBeGreaterThan(15);
		expect(searchResult.length).toBeGreaterThan(35);
	});
});
