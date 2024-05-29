import "jest-extended";

import { Client, Video } from "../../src";
import { commonBaseChannelTest } from "./CommonBaseChannel.spec";

const youtube = new Client({ youtubeClientOptions: { hl: "en" } });

describe("Video", () => {
	let video: Video;
	let videoWithChapters: Video;
	let endedLiveVideo: Video;
	let membershipVideo: Video;

	beforeAll(async () => {
		video = (await youtube.getVideo("OX31kZbAXsA")) as Video;
		videoWithChapters = (await youtube.getVideo("3jWRrafhO7M")) as Video;
		endedLiveVideo = (await youtube.getVideo("iXn9O-Rzb_M")) as Video;
		membershipVideo = (await youtube.getVideo("ALz5YW2i5y0")) as Video;
	});

	it("match getVideo result", () => {
		expect(video.id).toBe("OX31kZbAXsA");
		expect(video.title).toBe(
			"Does High FPS make you a better gamer? Ft. Shroud - FINAL ANSWER"
		);
		expect(video.duration).toBe(2172);
		expect(typeof video.description).toBe("string");
		commonBaseChannelTest(video.channel!);
		expect(typeof video.uploadDate).toBe("string");
		expect(video.viewCount).toBeGreaterThan(8000000);
		expect(video.likeCount).toBeGreaterThan(245000);
		expect(video.isLiveContent).toBeFalse();
		expect(video.tags.length).toBe(1);
		expect(video.tags[0]).toBe("#FramesWinGames");
		expect(video.related.items.length).toBeGreaterThan(0);
	});

	it("load video comments", async () => {
		expect(video.comments.items.length).toBe(0);
		let comments = await video.comments.next();
		expect(comments.length).toBe(20);
		expect(video.comments.items.length).toBe(20);
		comments = await video.comments.next(2);
		expect(comments.length).toBeGreaterThan(35);
		expect(video.comments.items.length).toBeGreaterThan(55);
	});

	it("load next related", async () => {
		await video.related.next(2);
		expect(video.related.items.length).toBeGreaterThan(40);
	});

	it("load video transcript", async () => {
		const result = await video.getTranscript();
		expect(result?.length).toBeGreaterThan(0);
	});

	it("match getVideo with chapters result", () => {
		expect(videoWithChapters.chapters.length).toBeGreaterThan(0);
		expect(typeof videoWithChapters.chapters[0].title).toBe("string");
		expect(typeof videoWithChapters.chapters[0].start).toBe("number");
		expect(typeof videoWithChapters.chapters[0].thumbnails[0].url).toBe("string");
	});

	it("match ended live getVideo result", () => {
		expect(endedLiveVideo.isLiveContent).toBeTrue();
		expect(endedLiveVideo.duration).toBe(4842);
	});

	it("match membership video getVideo result", () => {
		expect(membershipVideo.id).toBe("ALz5YW2i5y0");
		expect(membershipVideo.title).toBe("台湾のビール Beer in Taiwan");
		expect(membershipVideo.duration).toBe(196);
		expect(typeof membershipVideo.description).toBe("string");
		expect(typeof membershipVideo.uploadDate).toBe("string");
	});
});
