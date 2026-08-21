import "jest-extended";

import { Client, MixPlaylist } from "../../src";

const youtube = new Client({ youtubeClientOptions: { hl: "en" } });

describe("MixPlaylist", () => {
	let playlist: MixPlaylist;

	beforeAll(async () => {
		// mix ids expire, so derive one from a current search result
		const result = await youtube.search("lofi", { type: "video" });
		playlist = (await youtube.getPlaylist(`RD${result.items[0].id}`)) as MixPlaylist;
	});

	it("match getPlaylist result", () => {
		expect(playlist instanceof MixPlaylist).toBeTrue();
		expect(typeof playlist.title).toBe("string");
		expect(playlist.videos.length).toBeGreaterThan(0);
	});

	it("match expired getPlaylist", async () => {
		expect(await youtube.getPlaylist("RDjchDYHSBl_c")).toBeUndefined();
	});
});
