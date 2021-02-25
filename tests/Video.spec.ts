import { Client, Video, LiveVideo } from "../src";
import "jest-extended";

const youtube = new Client();

describe("Video", () => {
	let video: Video;
	let liveVideo: LiveVideo;
	let endedLiveVideo: Video;
	let incorrectVideo: undefined;

	beforeAll(async () => {
		video = (await youtube.getVideo("dQw4w9WgXcQ")) as Video;
		liveVideo = (await youtube.getVideo(
			"https://www.youtube.com/watch?v=5qap5aO4i9A"
		)) as LiveVideo;
		endedLiveVideo = (await youtube.getVideo(
			"https://www.youtube.com/watch?v=iXn9O-Rzb_M"
		)) as Video;
		incorrectVideo = (await youtube.getVideo("foo")) as undefined;
	});

	it("match getVideo result", () => {
		expect(video.id).toBe("dQw4w9WgXcQ");
		expect(video.title).toBe("Rick Astley - Never Gonna Give You Up (Video)");
		expect(video.duration).toBe(212);
		expect(typeof video.description).toBe("string");
		expect(video.channel?.id).toBe("UCuAXFkgsw1L7xaCfnd5JJOw");
		expect(video.channel?.name).toBe("Official Rick Astley");
		expect(video.channel?.url).toBe("https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw");
		expect(video.channel?.thumbnails.best).toStartWith("https://yt3.ggpht.com");
		expect(typeof video.uploadDate).toBe("string");
		expect(video.viewCount).toBeGreaterThan(680000000);
		expect(video.likeCount).toBeGreaterThan(5200000);
		expect(video.dislikeCount).toBeGreaterThan(190000);
		expect(video.isLiveContent).toBeFalse();
		expect(video.tags.length).toBe(3);
		expect(typeof video.upNext.id).toBe("string");
		expect(video.related.length).toBeGreaterThan(0);
	});

	it("load video comments", async () => {
		expect(video.comments.length).toBe(0);
		let comments = await video.nextComments();
		expect(comments.length).toBe(20);
		expect(video.comments.length).toBe(20);
		comments = await video.nextComments(2);
		expect(comments.length).toBe(40);
		expect(video.comments.length).toBe(60);
	});

	it("match live getVideo result", () => {
		expect(liveVideo instanceof LiveVideo).toBeTrue();
		expect(typeof liveVideo.watchingCount).toBe("number");
		expect(liveVideo.isLiveContent).toBeTrue();
	});

	it("match ended live getVideo result", () => {
		expect(endedLiveVideo.isLiveContent).toBeTrue();
		expect(endedLiveVideo.duration).toBe(4842);
	});

	it("match undefined getVideo result", () => {
		expect(incorrectVideo).toBeUndefined();
	});
});
