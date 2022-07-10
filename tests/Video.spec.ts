import "jest-extended";

import { Client, Video } from "../src";
import { commonChannelCompactTest } from "./CommonChannelCompact.spec";

const youtube = new Client({ youtubeClientOptions: { hl: "en" } });

describe("Video", () => {
	let video: Video;
	let endedLiveVideo: Video;

	beforeAll(async () => {
		video = (await youtube.getVideo("OX31kZbAXsA")) as Video;
		endedLiveVideo = (await youtube.getVideo("iXn9O-Rzb_M")) as Video;
	});

	it("match getVideo result", () => {
		expect(video.id).toBe("OX31kZbAXsA");
		expect(video.title).toBe(
			"Does High FPS make you a better gamer? Ft. Shroud - FINAL ANSWER"
		);
		expect(video.duration).toBe(2172);
		expect(typeof video.description).toBe("string");
		commonChannelCompactTest(video.channel!, { ignoreVideoCount: true });
		expect(typeof video.uploadDate).toBe("string");
		expect(video.viewCount).toBeGreaterThan(8000000);
		expect(video.likeCount).toBeGreaterThan(245000);
		expect(video.isLiveContent).toBeFalse();
		expect(video.tags.length).toBe(1);
		expect(video.tags[0]).toBe("#FramesWinGames");
		expect(video.related.length).toBeGreaterThan(0);
	});

	it("load video comments", async () => {
		expect(video.comments.length).toBe(0);
		let comments = await video.nextComments();
		expect(comments.length).toBe(20);
		expect(video.comments.length).toBe(20);
		comments = await video.nextComments(2);
		expect(comments.length).toBeGreaterThan(35);
		expect(video.comments.length).toBeGreaterThan(55);
	});

	it("load next related", async () => {
		await video.nextRelated(2);
		expect(video.related.length).toBeGreaterThan(40);
	});

	it("match ended live getVideo result", () => {
		expect(endedLiveVideo.isLiveContent).toBeTrue();
		expect(endedLiveVideo.duration).toBe(4842);
	});
});
