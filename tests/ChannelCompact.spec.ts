import { ChannelCompact, Client } from "../src";
import "jest-extended";
import { commonChannelCompactTest } from "./CommonChannelCompact.spec";

const youtube = new Client();

describe("ChannelCompact", () => {
	let channel: ChannelCompact;

	beforeAll(async () => {
		channel = (await youtube.findOne("Linus Tech Tips", { type: "channel" })) as ChannelCompact;
	});

	it("match channel from search result", () => {
		commonChannelCompactTest(channel);
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
