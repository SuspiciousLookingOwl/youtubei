import "jest-extended";

import { Client, PlaylistCompact, SearchManager, SearchType } from "../src";

const youtube = new Client();

describe("PlaylistCompact", () => {
	let playlists: SearchManager<SearchType.PLAYLIST>;

	beforeAll(async () => {
		playlists = await youtube.search("100 seconds of code fireship", {
			type: SearchType.PLAYLIST,
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
