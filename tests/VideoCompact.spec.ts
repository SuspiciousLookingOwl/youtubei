import { Client, SearchResult } from "../dist";
import "jest-extended";

const youtube = new Client();

describe("VideoCompact", () => {
	let videos: SearchResult<{ type: "video" }>;

	beforeAll(async () => {
		videos = await youtube.search("Never gonna give you up", {
			type: "video",
		});
	});

	it("match 1st video from search result", () => {
		const video = videos[0];
		expect(video.id).toBe("dQw4w9WgXcQ");
		expect(video.title).toBe("Rick Astley - Never Gonna Give You Up (Video)");
		expect(video.duration).toBe(213);
		expect(video.thumbnail).toStartWith("https://i.ytimg.com/");
		expect(video.thumbnails.length).toBeGreaterThan(1);
		expect(video.channel?.id).toBe("UCuAXFkgsw1L7xaCfnd5JJOw");
		expect(video.channel?.name).toBe("Official Rick Astley");
		expect(video.channel?.url).toBe("https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw");
		expect(typeof video.uploadDate).toBe("string");
		expect(video.viewCount).toBeGreaterThan(680000000);
	});
});
