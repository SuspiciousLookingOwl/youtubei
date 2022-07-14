import "jest-extended";

import { Client, PlaylistCompact, SearchResult } from "../src";

const youtube = new Client();

describe("PlaylistCompact", () => {
	let playlist: SearchResult<"playlist">;

	beforeAll(async () => {
		playlist = (await youtube.findOne("100 seconds of code fireship", {
			type: "playlist",
		})) as SearchResult<"playlist">;
	});

	it("match 1st playlist from search result", () => {
		expect(playlist instanceof PlaylistCompact).toBeTrue();
		expect(typeof playlist.id).toBe("string");
		expect(typeof playlist.title).toBe("string");
		expect(typeof playlist.thumbnails.best).toBe("string");
		expect(typeof playlist.videoCount).toBe("number");
	});
});
