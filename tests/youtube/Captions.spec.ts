import "jest-extended";

import { Client, Video } from "../../src";

const youtube = new Client({ youtubeClientOptions: { hl: "en" } });

// Video with human-written captions in several languages
const CAPTIONED_VIDEO_ID = "dQw4w9WgXcQ";
// Video with auto-generated (asr) captions only
const ASR_VIDEO_ID = "OX31kZbAXsA";

describe("Captions", () => {
	let video: Video;
	let asrVideo: Video;

	beforeAll(async () => {
		video = (await youtube.getVideo(CAPTIONED_VIDEO_ID)) as Video;
		asrVideo = (await youtube.getVideo(ASR_VIDEO_ID)) as Video;
	});

	it("parses caption tracks from the player response", () => {
		expect(video.captions).not.toBeNull();
		expect(video.captions!.languages.length).toBeGreaterThan(0);
	});

	it("exposes a name for every caption language", () => {
		for (const language of video.captions!.languages) {
			expect(typeof language.code).toBe("string");
			expect(typeof language.name).toBe("string");
		}
	});

	it("loads captions by language code", async () => {
		const captions = await video.captions!.get("en");
		expect(captions?.length).toBeGreaterThan(0);
		expect(typeof captions![0].text).toBe("string");
		expect(captions![0].end).toBe(captions![0].start + captions![0].duration);
	});

	it("falls back to the client hl when no language code is given", async () => {
		const captions = await video.captions!.get();
		expect(captions?.length).toBeGreaterThan(0);
	});

	it("loads captions through CaptionLanguage.get()", async () => {
		const captions = await video.captions!.languages[0].get();
		expect(captions?.length).toBeGreaterThan(0);
	});

	it("returns undefined for an unavailable language", async () => {
		expect(await video.captions!.get("zz")).toBeUndefined();
	});

	it("joins multi-segment auto-generated captions without inserting commas", async () => {
		const captions = await asrVideo.captions!.get("en");
		const multiSegment = captions!.find((c) => c.segments.length > 1);
		expect(multiSegment).toBeDefined();
		expect(multiSegment!.text).toBe(multiSegment!.segments.map((s) => s.utf8).join(""));
	});
});
