import "jest-extended";

import { Client, Video } from "../../src";

describe("Reply", () => {
	let client: Client;
	let video: Video;
	beforeAll(async () => {
		client = new Client();
		video = (await client.getVideo("PziYflu8cB8")) as Video;
		await video.comments.next();
	});

	it("match reply load", async () => {
		const replies = await video.comments.items[0].replies.next();
		expect(replies.length).toBeGreaterThanOrEqual(1);
	});
});
