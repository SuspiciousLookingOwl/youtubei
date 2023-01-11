import "jest-extended";

import { Client, Playlist } from "../../src";
import { commonBaseChannelTest } from "./CommonBaseChannel.spec";

const youtube = new Client();

describe("Playlist", () => {
	let playlist: Playlist;
	let invalidPlaylist: undefined;

	beforeAll(async () => {
		playlist = (await youtube.getPlaylist("UUXuqSBlHAE6Xw-yeJA0Tunw")) as Playlist;
		invalidPlaylist = (await youtube.getPlaylist("foo")) as undefined;
	});

	it("match getPlaylist result", () => {
		expect(playlist.id).toBe("UUXuqSBlHAE6Xw-yeJA0Tunw");
		expect(playlist.title).toBe("Uploads from Linus Tech Tips");
		expect(playlist.thumbnails.length).toBeGreaterThan(0);
		expect(playlist.videoCount).toBeGreaterThan(5000);
		expect(typeof playlist.viewCount).toBe("number");
		expect(typeof playlist.lastUpdatedAt).toBe("string");
		commonBaseChannelTest(playlist.channel!, {
			ignoreVideoCount: true,
			ignoreThumbnails: true,
		});
		expect(playlist.videos.items.length).toBe(100);
	});

	it("match invalid getPlaylist", async () => {
		expect(invalidPlaylist).toBeUndefined();
	});

	it("load continuation", async () => {
		let newVideos = await playlist.videos.next();
		expect(newVideos.length).toBe(100);
		expect(playlist.videos.items.length).toBe(200);
		newVideos = await playlist.videos.next(2);
		expect(newVideos.length).toBe(200);
		expect(playlist.videos.items.length).toBe(400);
		commonBaseChannelTest(playlist.videos.items[0].channel!, {
			ignoreVideoCount: true,
			ignoreThumbnails: true,
		});
	});
});
