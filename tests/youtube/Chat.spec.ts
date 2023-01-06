import "jest-extended";

import { Chat, Client } from "../../src";
import liveChatTextMessageRenderer from "./data/liveChatTextMessageRenderer.json";

describe("Chat", () => {
	it("match chat load", () => {
		const chat = new Chat({ client: new Client() }).load(liveChatTextMessageRenderer);

		expect(chat.id).toBe(
			"CjkKGkNNQ2syZDcwaGU0Q0ZSVEh3UW9kalNNQndREhtDTkt2cExqMGhlNENGYzdKMVFvZEhoRUs0QTA%3D"
		);
		expect(chat.author.name).toBe("ChilledCow");
		expect(chat.message).toBe(
			"Join the Discord server to meet the friendliest and chillest people on the internet! There's also weekly giveaway there → https://bit.ly/discord-giveaway"
		);
		expect(chat.timestamp).toBe(1609888158863980);
	});
});
