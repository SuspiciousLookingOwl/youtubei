import { Channel, PlaylistCompact, VideoCompact } from "../dist/index";
import "jest-extended";

const CHANNEL_ID = "UCyOfqgtsQaM3S-VZnsYnHjQ";

/**
 * Just making sure that it's getting the correct nested object from youtubei
 */
describe("Channel", () => {
	const channel = new Channel({ id: CHANNEL_ID });
	let videos: VideoCompact[];
	let playlists: PlaylistCompact[];

	beforeAll(async () => {
		videos = await channel.getVideos();
		playlists = await channel.getPlaylists();
	});

	it("getVideos", () => {
		expect(videos.length).toBeGreaterThan(1);
	});

	it("getPlaylist", () => {
		expect(playlists.length).toBeGreaterThan(1);
	});
});
