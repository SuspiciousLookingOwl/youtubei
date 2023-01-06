import "jest-extended";

import { VideoCompact } from "../../src";
import { commonBaseChannelTest } from "./CommonBaseChannel.spec";

type Ignore = {
	ignoreChannelVideoCount: boolean;
	ignoreUploadDate: boolean;
	ignoreViewCount: boolean;
};

export const commonVideoCompactTest = (
	video: VideoCompact,
	{ ignoreChannelVideoCount = false, ignoreUploadDate = false, ignoreViewCount = false }: Ignore
): void => {
	expect(video.id).toBe("PziYflu8cB8");
	expect(video.title).toBe("Kubernetes Explained in 100 Seconds");
	expect(video.thumbnails.best).toStartWith("https://i.ytimg.com/");
	expect(video.duration).toBeGreaterThan(126);
	expect(video.isLive).toBe(false);
	expect(video.isPrivateOrDeleted).toBe(false);
	commonBaseChannelTest(video.channel!, { ignoreVideoCount: ignoreChannelVideoCount });
	if (!ignoreUploadDate) expect(typeof video.uploadDate).toBe("string");
	if (!ignoreViewCount) expect(video.viewCount).toBeGreaterThan(135000);
};

describe("Common tests for VideoCompact implementations", () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	test("should be used per implementation", () => {});
});
