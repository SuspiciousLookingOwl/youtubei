import "jest-extended";

import { Comment, Video } from "../src";

describe("Comment", () => {
	it("url should match", () => {
		const comment = new Comment({
			id: "commentId",
			video: new Video({ id: "videoId" }),
		});

		expect(comment.url).toBe("https://www.youtube.com/watch?v=videoId&lc=commentId");
	});
});
