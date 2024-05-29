import "jest-extended";

import { BaseChannel } from "../../src";

type Ignore = {
	ignoreThumbnails?: boolean;
};

export const commonBaseChannelTest = (
	channel: BaseChannel,
	{ ignoreThumbnails }: Ignore = {
		ignoreThumbnails: false,
	}
): void => {
	expect(channel.id).toBe("UCXuqSBlHAE6Xw-yeJA0Tunw");
	expect(channel.name).toBe("Linus Tech Tips");
	if (!ignoreThumbnails) expect(channel.thumbnails?.best).toStartWith("https://yt3");
	expect(channel.url).toBe("https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw");
};

describe("Common tests for Channel implementations", () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	test("should be used per implementation", () => {});
});
