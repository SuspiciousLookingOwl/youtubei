import { Channel, PlaylistCompact, Client, Video, Playlist, SearchResult } from "../dist";
import "jest-extended";

const youtube = new Client();

const SEARCH_QUERY = "Never gonna give you up";
const VIDEO_ID = "dQw4w9WgXcQ";
const PLAYLIST_ID = "UUHnyfMqiRRG1u-2MsSQLbXA";

describe("Client", () => {
	describe("search video", () => {
		let videos: SearchResult<{ type: "video" }>;

		beforeAll(async () => {
			videos = await youtube.search(SEARCH_QUERY, {
				type: "video",
			});
		});

		it("search result should be more than 15", () => {
			expect(videos.length).toBeGreaterThan(15);
		});

		it("match 1st video from search result", () => {
			const video = videos[0];
			expect(video.id).toBe(VIDEO_ID);
			expect(video.title).toBe("Rick Astley - Never Gonna Give You Up (Video)");
			expect(video.duration).toBe(213);
			expect(video.thumbnail).toStartWith("https://i.ytimg.com/");
			expect(video.thumbnails.length).toBeGreaterThan(1);
			expect(video.channel?.id).toBe("UCuAXFkgsw1L7xaCfnd5JJOw");
			expect(video.channel?.name).toBe("Official Rick Astley");
			expect(video.channel?.url).toBe(
				"https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw"
			);
			expect(typeof video.uploadDate).toBe("string");
			expect(video.viewCount).toBeGreaterThan(680000000);
		});

		it("load continuation", async () => {
			const nextVideos = await videos.next();
			expect(nextVideos.length).toBeGreaterThan(15);
			expect(videos.length).toBeGreaterThan(35);
		});
	});

	describe("search channel", () => {
		let channels: Channel[];

		beforeAll(async () => {
			channels = await youtube.search("Linus Tech Tips", {
				limit: 1,
				type: "channel",
			});
		});

		it("match 1st channel from search result", () => {
			const channel = channels[0];
			expect(channel.id).toBe("UCXuqSBlHAE6Xw-yeJA0Tunw");
			expect(channel.name).toBe("Linus Tech Tips");
			expect(typeof channel.thumbnail).toBe("string");
			expect(channel.videoCount).toBeGreaterThan(4900);
		});
	});

	describe("search playlist", () => {
		let playlists: PlaylistCompact[];

		beforeAll(async () => {
			playlists = await youtube.search("WAN show", {
				limit: 1,
				type: "playlist",
			});
		});

		it("match 1st playlist from search result", () => {
			const playlist = playlists[0];
			expect(playlist instanceof PlaylistCompact).toBeTrue();
			expect(typeof playlist.id).toBe("string");
			expect(typeof playlist.title).toBe("string");
			expect(typeof playlist.thumbnail).toBe("string");
			expect(typeof playlist.videoCount).toBe("number");
		});
	});

	describe("getPlaylist", () => {
		let playlist: Playlist;
		let invalidPlaylist: undefined;

		beforeAll(async () => {
			playlist = (await youtube.getPlaylist(PLAYLIST_ID)) as Playlist;
			invalidPlaylist = (await youtube.getPlaylist("foo")) as undefined;
		});

		it("match getPlaylist result", () => {
			expect(playlist.id).toBe(PLAYLIST_ID);
			expect(playlist.title).toBe("Uploads from Veritasium");
			expect(playlist.videoCount).toBeGreaterThan(300);
			expect(typeof playlist.viewCount).toBe("number");
			expect(typeof playlist.lastUpdatedAt).toBe("string");
			expect(playlist.channel?.id).toBe("UCHnyfMqiRRG1u-2MsSQLbXA");
			expect(playlist.channel?.name).toBe("Veritasium");
			expect(playlist.channel?.url).toBe("https://www.youtube.com/c/veritasium");
			expect(playlist.channel?.thumbnail).toStartWith("https://yt3.ggpht.com");
			expect(playlist.videos.length).toBe(100);
			expect(typeof playlist.videos[0].id).toBe("string");
			expect(typeof playlist.videos[0].title).toBe("string");
			expect(typeof playlist.videos[0].duration).toBe("number");
			expect(playlist.videos[0].thumbnail).toStartWith("https://i.ytimg.com/");
		});

		it("match invalid getPlaylist", async () => {
			expect(invalidPlaylist).toBeUndefined();
		});

		it("load continuation", async () => {
			expect(playlist.videos.length).toBe(100);
			let newVideos = await playlist.next();
			expect(newVideos.length).toBe(100);
			expect(playlist.videos.length).toBe(200);
			newVideos = await playlist.next(0);
			expect(newVideos.length).toBeGreaterThan(100);
			expect(playlist.videos.length).toBe(playlist.videoCount);
		});
	});

	describe("getVideo", () => {
		let video: Video;
		let liveVideo: Video;
		let endedLiveVideo: Video;
		let incorrectVideo: undefined;

		beforeAll(async () => {
			video = (await youtube.getVideo(VIDEO_ID)) as Video;
			liveVideo = (await youtube.getVideo(
				"https://www.youtube.com/watch?v=5qap5aO4i9A"
			)) as Video;
			endedLiveVideo = (await youtube.getVideo(
				"https://www.youtube.com/watch?v=iXn9O-Rzb_M"
			)) as Video;
			incorrectVideo = (await youtube.getVideo("foo")) as undefined;
		});

		it("match getVideo result", () => {
			expect(video.id).toBe(VIDEO_ID);
			expect(video.title).toBe("Rick Astley - Never Gonna Give You Up (Video)");
			expect(video.duration).toBe(212);
			expect(typeof video.description).toBe("string");
			expect(video.channel?.id).toBe("UCuAXFkgsw1L7xaCfnd5JJOw");
			expect(video.channel?.name).toBe("Official Rick Astley");
			expect(video.channel?.url).toBe(
				"https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw"
			);
			expect(video.channel?.thumbnail).toStartWith("https://yt3.ggpht.com");
			expect(typeof video.uploadDate).toBe("string");
			expect(video.viewCount).toBeGreaterThan(680000000);
			expect(video.likeCount).toBeGreaterThan(5200000);
			expect(video.dislikeCount).toBeGreaterThan(190000);
			expect(video.isLiveContent).toBeFalse();
			expect(video.tags.length).toBe(3);
			expect(typeof video.upNext.id).toBe("string");
			expect(video.related.length).toBeGreaterThan(0);
		});

		it("match live getVideo result", () => {
			expect(liveVideo.isLiveContent).toBeTrue();
			expect(liveVideo.duration).toBeNull();
		});

		it("match ended live getVideo result", () => {
			expect(endedLiveVideo.isLiveContent).toBeTrue();
			expect(endedLiveVideo.duration).toBe(4842);
		});

		it("match undefined getVideo result", () => {
			expect(incorrectVideo).toBeUndefined();
		});
	});
});
