import "jest-extended";

import { MusicClient, MusicSongCompact } from "../../src";

const music = new MusicClient();

describe("MusicClient", () => {
	it("should load all result", async () => {
		const result = await music.search("foo");
		expect(result.items.length).toBeGreaterThan(1);
	});

	it("should return songs", async () => {
		const result = await music.search("foo", "song");
		const next = await result.next();
		expect(result.items.length).toBeGreaterThan(1);
		expect(result.items[0]).toBeInstanceOf(MusicSongCompact);
		expect(next.length).toBeGreaterThan(1);
		expect(next[0]).toBeInstanceOf(MusicSongCompact);
	});

	it("should load lyric", async () => {
		const lyric = await music.getLyrics("GJvGf_ifiKw");
		expect(lyric?.content).toBeTruthy();
		expect(lyric?.description).toBeTruthy();
	});
});
