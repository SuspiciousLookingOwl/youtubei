import { Channel, Client } from "../src";
import "jest-extended";
import { commonChannelTest } from "./CommonChannel.spec";

const youtube = new Client();

describe("Channel", () => {
	let channel: Channel;

	beforeAll(async () => {
		channel = (await youtube.findOne("Linus Tech Tips", { type: "channel" })) as Channel;
	});

	it("match channel from search result", () => {
		commonChannelTest(channel);
	});

	it("load videos", async () => {
		const videos = await channel.nextVideos(2);
		expect(videos.length).toBeGreaterThan(50);
		expect(channel.videos.length).toBe(videos.length);
	});

	it("load playlists", async () => {
		const playlists = await channel.nextPlaylists(2);
		expect(playlists.length).toBe(60);
		expect(channel.playlists.length).toBe(playlists.length);
	});
});
