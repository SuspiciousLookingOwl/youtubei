import "jest-extended";

import { MusicClient } from "../../src";

const music = new MusicClient();

describe("MusicClient", () => {
	it("should contains more than 1 shelves", async () => {
		const result = await music.search("foo");
		expect(result.length).toBeGreaterThan(1);
	});

	it("should load lyric", async () => {
		const lyric = await music.getLyrics("GJvGf_ifiKw");
		expect(lyric?.content).toBeTruthy();
		expect(lyric?.description).toBeTruthy();
	});
});
