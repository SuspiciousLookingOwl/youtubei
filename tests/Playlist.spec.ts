import { Client, Playlist } from "../src";
import "jest-extended";

const youtube = new Client();

describe("Playlist", () => {
	let playlist: Playlist;
	let invalidPlaylist: undefined;

	beforeAll(async () => {
		playlist = (await youtube.getPlaylist("UUHnyfMqiRRG1u-2MsSQLbXA")) as Playlist;
		invalidPlaylist = (await youtube.getPlaylist("foo")) as undefined;
	});

	it("match getPlaylist result", () => {
		expect(playlist.id).toBe("UUHnyfMqiRRG1u-2MsSQLbXA");
		expect(playlist.title).toBe("Uploads from Veritasium");
		expect(playlist.videoCount).toBeGreaterThan(300);
		expect(typeof playlist.viewCount).toBe("number");
		expect(typeof playlist.lastUpdatedAt).toBe("string");
		expect(playlist.channel?.id).toBe("UCHnyfMqiRRG1u-2MsSQLbXA");
		expect(playlist.channel?.name).toBe("Veritasium");
		expect(playlist.channel?.customUrl).toBe("https://www.youtube.com/c/veritasium");
		expect(playlist.channel?.thumbnails.best).toStartWith("https://yt3.ggpht.com");
		expect(playlist.videos.length).toBe(100);
		expect(typeof playlist.videos[0].id).toBe("string");
		expect(typeof playlist.videos[0].title).toBe("string");
		expect(typeof playlist.videos[0].duration).toBe("number");
		expect(playlist.videos[0].thumbnails.best).toStartWith("https://i.ytimg.com/");
	});

	it("match invalid getPlaylist", async () => {
		expect(invalidPlaylist).toBeUndefined();
	});

	it("load continuation", async () => {
		expect(playlist.videos.length).toBe(100);
		let newVideos = await playlist.next();
		expect(newVideos.length).toBe(100);
		expect(playlist.videos.length).toBe(200);
		newVideos = await playlist.next(0);
		expect(newVideos.length).toBeGreaterThan(100);
		expect(playlist.videos.length).toBe(playlist.videoCount);
	});
});
