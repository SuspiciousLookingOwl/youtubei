import { Channel, Client } from "../dist";
import "jest-extended";

const youtube = new Client();

describe("Channel", () => {
	let channel: Channel;

	beforeAll(async () => {
		const channels = await youtube.search("Fireship", {
			type: "channel",
		});
		channel = channels[0];
	});

	it("match 1st channel from search result", () => {
		expect(channel.id).toBe("UCsBjURrPoezykLs9EqgamOA");
		expect(channel.name).toBe("Fireship");
		expect(typeof channel.thumbnails.best).toBe("string");
		expect(channel.videoCount).toBeGreaterThan(200);
	});

	it("getVideos", async () => {
		const videos = await channel.getVideos();
		expect(videos.length).toBeGreaterThan(1);
	});

	it("getPlaylist", async () => {
		const playlists = await channel.getPlaylists();
		expect(playlists.length).toBeGreaterThan(1);
	});
});
