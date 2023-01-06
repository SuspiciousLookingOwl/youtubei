import "jest-extended";

import { BaseChannel } from "../../src";

type Ignore = {
	ignoreVideoCount?: boolean;
	ignoreThumbnails?: boolean;
};

export const commonBaseChannelTest = (
	channel: BaseChannel,
	{ ignoreVideoCount, ignoreThumbnails }: Ignore = {
		ignoreVideoCount: false,
		ignoreThumbnails: false,
	}
): void => {
	expect(channel.id).toBe("UCXuqSBlHAE6Xw-yeJA0Tunw");
	expect(channel.name).toBe("Linus Tech Tips");
	if (!ignoreThumbnails) expect(channel.thumbnails?.best).toStartWith("https://yt3");
	if (!ignoreVideoCount) expect(channel.videoCount).toBeGreaterThan(250);
	expect(channel.url).toBe("https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw");
};

describe("Common tests for Channel implementations", () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	test("should be used per implementation", () => {});
});
