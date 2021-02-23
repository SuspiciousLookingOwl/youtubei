import { Client, PlaylistCompact, SearchResult } from "../src";
import "jest-extended";

const youtube = new Client();

describe("PlaylistCompact", () => {
	let playlists: SearchResult<{ type: "playlist" }>;

	beforeAll(async () => {
		playlists = await youtube.search("WAN show", {
			type: "playlist",
		});
	});

	it("match 1st playlist from search result", () => {
		const playlist = playlists[0];
		expect(playlist instanceof PlaylistCompact).toBeTrue();
		expect(typeof playlist.id).toBe("string");
		expect(typeof playlist.title).toBe("string");
		expect(typeof playlist.thumbnails.best).toBe("string");
		expect(typeof playlist.videoCount).toBe("number");
	});
});
