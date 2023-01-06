import "jest-extended";

import { BaseChannel, Client } from "../../src";
import { commonBaseChannelTest } from "./CommonBaseChannel.spec";

const youtube = new Client();

describe("BaseChannel", () => {
	let channel: BaseChannel;

	beforeAll(async () => {
		channel = (await youtube.findOne("Linus Tech Tips", {
			type: "channel",
		})) as BaseChannel;
	});

	it("match channel from search result", () => {
		commonBaseChannelTest(channel, { ignoreVideoCount: true });
	});

	it("load videos", async () => {
		const videos = await channel.videos.next(2);
		expect(videos.length).toBeGreaterThan(50);
		expect(channel.videos.items.length).toBe(videos.length);
	});

	it("load playlists", async () => {
		const playlists = await channel.playlists.next(2);
		expect(playlists.length).toBe(60);
		expect(channel.playlists.items.length).toBe(playlists.length);
	});
});
