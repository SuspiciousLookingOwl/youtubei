import { Channel } from "../src";
import "jest-extended";

type Ignore = {
	ignoreVideoCount: boolean;
};

export const commonChannelTest = (
	channel: Channel,
	{ ignoreVideoCount }: Ignore = { ignoreVideoCount: false }
): void => {
	expect(channel.id).toBe("UCXuqSBlHAE6Xw-yeJA0Tunw");
	expect(channel.name).toBe("Linus Tech Tips");
	expect(channel.thumbnails.best).toStartWith("https://yt3.ggpht.com");
	if (!ignoreVideoCount) expect(channel.videoCount).toBeGreaterThan(250);
	expect(channel.url).toBe("https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw");
};

describe("Common tests for Channel implementations", () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	test("should be used per implementation", () => {});
});
