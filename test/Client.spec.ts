import { Channel, PlaylistCompact, Client, Video, Playlist, SearchResult } from "../dist";
import "jest-extended";

const youtube = new Client();

const SEARCH_QUERY = "Never gonna give you up";
const VIDEO_ID = "dQw4w9WgXcQ";
const PLAYLIST_ID = "PLAo4aa6NKcpjx0SVA3JzZHw2wJ3hQ4vmO";

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
			expect(playlist.title).toBe("Scrape Youtube Test");
			expect(playlist.videoCount).toBe(5);
			expect(typeof playlist.viewCount).toBe("number");
			expect(typeof playlist.lastUpdatedAt).toBe("string");
			expect(playlist.channel?.id).toBe("UCXzoobwjLSyFECcWi9K1iMg");
			expect(playlist.channel?.name).toBe("Vincent Jonathan");
			expect(playlist.channel?.url).toBe(
				"https://www.youtube.com/channel/UCXzoobwjLSyFECcWi9K1iMg"
			);
			expect(playlist.channel?.thumbnail).toStartWith("https://yt3.ggpht.com");
			expect(playlist.videos.length).toBe(5);
			expect(playlist.videos[0].id).toBe("aROa_qE2FLM");
			expect(playlist.videos[0].title).toBe("The Paper Kites - Don’t Keep Driving");
			expect(playlist.videos[0].duration).toBe(321);
			expect(playlist.videos[0].thumbnail).toStartWith("https://i.ytimg.com/");
		});

		it("match invalid getPlaylist", async () => {
			expect(invalidPlaylist).toBeUndefined();
		});

		it("match videos count from continuation limit", async () => {
			playlist = (await youtube.getPlaylist("UUsBjURrPoezykLs9EqgamOA", {
				continuationLimit: 2,
			})) as Playlist;
			expect(playlist.videos.length).toBe(200);
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
