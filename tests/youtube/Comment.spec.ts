import "jest-extended";

import { Client, Comment, Video } from "../../src";

describe("Comment", () => {
	it("url should match", () => {
		const client = new Client();

		const comment = new Comment({
			id: "commentId",
			video: new Video({ id: "videoId", client }),
			client: client,
		});

		expect(comment.url).toBe("https://www.youtube.com/watch?v=videoId&lc=commentId");
	});
});
