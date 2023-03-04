import "jest-extended";

import { Client, LiveVideo } from "../../src";

const youtube = new Client({ youtubeClientOptions: { hl: "en" } });

describe("Video", () => {
	let video: LiveVideo;

	beforeAll(async () => {
		video = (await youtube.getVideo("IOJO0zj55jo")) as LiveVideo;
	});

	it("match live getVideo result", () => {
		expect(video instanceof LiveVideo).toBeTrue();
		expect(typeof video.watchingCount).toBe("number");
		expect(video.isLiveContent).toBeTrue();
	});
});
