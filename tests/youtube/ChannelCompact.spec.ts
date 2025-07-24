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
		commonBaseChannelTest(channel);
	});

	it("load videos", async () => {
		const videos = await channel.videos.next(2);
		expect(videos.length).toBeGreaterThan(50);
		expect(channel.videos.items.length).toBe(videos.length);
	});

	it("load playlists", async () => {
		const playlists = await channel.playlists.next(2);
		expect(playlists.length).toBeGreaterThanOrEqual(30);
		expect(channel.playlists.items.length).toBe(playlists.length);
	});

	it("load posts", async () => {
		const posts = await channel.posts.next(2);
		expect(posts.length).toBeGreaterThanOrEqual(10);
		expect(channel.posts.items.length).toBe(posts.length);
	});
});
