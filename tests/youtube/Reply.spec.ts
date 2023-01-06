import "jest-extended";

import { Client, Reply } from "../../src";
import commentReplyRenderer from "./data/commentReplyRenderer.json";

describe("Chat", () => {
	it("match chat load", () => {
		const reply = new Reply({ client: new Client() }).load(commentReplyRenderer);

		expect(reply.id).toBe("UgwxLeoyuMjwpVQZjP14AaABAg.9KBiYFA7H5w9KGoxAGz1EC");
		expect(reply.content).toBe(" @Adam Henriksson  Makes sense.");
		expect(reply.publishDate).toBe("1 day ago");
		expect(reply.likeCount).toBe(0);
		expect(reply.isAuthorChannelOwner).toBeFalse();
		expect(reply.author.id).toBe("UC6JbD_MR9t0-riw1j4ZuE9Q");
		expect(reply.author.name).toBe("LongJourneys");
		expect(reply.author.thumbnails?.length).toBe(3);
	});
});
