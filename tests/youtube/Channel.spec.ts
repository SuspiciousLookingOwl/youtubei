import "jest-extended";

import { Channel, Client } from "../../src";

const youtube = new Client();

describe("BaseChannel", () => {
	let channel: Channel;

	beforeAll(async () => {
		channel = (await youtube.getChannel("UC6nSFpj9HTCZ5t-N3Rm3-HA")) as Channel;
	});

	it("match result", () => {
		expect(channel.id).toBe("UC6nSFpj9HTCZ5t-N3Rm3-HA");
		expect(channel.name).toBe("Vsauce");
		expect(channel.url).toBe("https://www.youtube.com/channel/UC6nSFpj9HTCZ5t-N3Rm3-HA");
	});
});
