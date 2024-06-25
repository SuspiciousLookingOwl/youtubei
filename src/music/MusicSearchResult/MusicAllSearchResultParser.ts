import { getDuration, Shelf, stripToInt, Thumbnails, YoutubeRawData } from "../../common";
import { MusicAlbumCompact } from "../MusicAlbumCompact";
import { MusicArtistCompact } from "../MusicArtistCompact";
import { MusicBaseArtist } from "../MusicBaseArtist";
import { MusicBaseChannel } from "../MusicBaseChannel";
import { MusicClient, MusicTopShelf } from "../MusicClient";
import { MusicPlaylistCompact } from "../MusicPlaylistCompact";
import { MusicSongCompact } from "../MusicSongCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";

export class MusicAllSearchResultParser {
	static parseTopResult(data: YoutubeRawData, client: MusicClient): MusicTopShelf | undefined {
		const sectionListContents =
			data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
				.sectionListRenderer.contents;

		const top = sectionListContents.find((f: YoutubeRawData) => f.musicCardShelfRenderer)
			?.musicCardShelfRenderer;

		if (!top) return;

		const { browseEndpoint, watchEndpoint } = top.title.runs[0].navigationEndpoint;
		const id = watchEndpoint?.videoId || browseEndpoint?.browseId;
		const type =
			watchEndpoint?.watchEndpointMusicSupportedConfigs.watchEndpointMusicConfig
				.musicVideoType ||
			browseEndpoint?.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig
				.pageType;
		const title = top.title.runs[0].text;
		const thumbnail = top.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;

		let topResult!:
			| MusicVideoCompact
			| MusicAlbumCompact
			| MusicArtistCompact
			| MusicPlaylistCompact
			| undefined;

		if (type === "MUSIC_VIDEO_TYPE_ATV") {
			topResult = new MusicSongCompact({
				client,
				id,
				title,
				duration: getDuration(top.subtitle.runs.at(-1).text),
				artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
				album: MusicAllSearchResultParser.parseAlbum(top.subtitle.runs, client),
				thumbnails: new Thumbnails().load(thumbnail),
			});
		} else if (type === "MUSIC_VIDEO_TYPE_UGC" || type === "MUSIC_VIDEO_TYPE_OMV") {
			topResult = new MusicVideoCompact({
				client,
				id,
				title,
				duration: getDuration(top.subtitle.runs.at(-1).text),
				artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
				thumbnails: new Thumbnails().load(thumbnail),
			});
		} else if (type === "MUSIC_PAGE_TYPE_ALBUM") {
			topResult = new MusicAlbumCompact({
				client,
				id,
				title,
				artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
				thumbnails: new Thumbnails().load(thumbnail),
			});
		} else if (type === "MUSIC_PAGE_TYPE_ARTIST") {
			topResult = new MusicArtistCompact({
				client,
				id,
				name: title,
				thumbnails: new Thumbnails().load(thumbnail),
			});
		} else if (type === "MUSIC_PAGE_TYPE_PLAYLIST") {
			topResult = new MusicPlaylistCompact({
				client,
				id,
				title,
				channel: MusicAllSearchResultParser.parseChannel(top.subtitle.runs, client),
				thumbnails: new Thumbnails().load(thumbnail),
			});
		}

		let more:
			| (MusicVideoCompact | MusicAlbumCompact | MusicArtistCompact | MusicPlaylistCompact)[]
			| undefined;

		if (top.contents) {
			more = top.contents
				.filter((c: YoutubeRawData) => c.musicResponsiveListItemRenderer)
				.map((c: YoutubeRawData) => MusicAllSearchResultParser.parseSearchItem(c, client));
		}

		return {
			item: topResult,
			more,
		};
	}

	static parseSearchResult(
		data: YoutubeRawData,
		client: MusicClient
	): Shelf<MusicVideoCompact[] | MusicAlbumCompact[] | MusicPlaylistCompact[]>[] {
		const sectionListContents =
			data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
				.sectionListRenderer.contents;

		const shelves = sectionListContents
			.filter((f: YoutubeRawData) => f.musicShelfRenderer)
			.map((m: YoutubeRawData) => m.musicShelfRenderer);

		return shelves.map((m: YoutubeRawData) => ({
			title: m.title.runs.map((r: YoutubeRawData) => r.text).join(),
			items: m.contents
				.map((c: YoutubeRawData) => MusicAllSearchResultParser.parseSearchItem(c, client))
				.filter((i: unknown) => i),
		}));
	}

	private static parseSearchItem(content: YoutubeRawData, client: MusicClient) {
		const item = content.musicResponsiveListItemRenderer;
		const playEndpoint =
			item.overlay?.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
				.playNavigationEndpoint;

		if (playEndpoint?.watchEndpoint) {
			const pageType =
				playEndpoint.watchEndpoint.watchEndpointMusicSupportedConfigs
					.watchEndpointMusicConfig.musicVideoType;

			return MusicAllSearchResultParser.parseVideoItem(item, pageType, client);
		} else if (playEndpoint?.watchPlaylistEndpoint.params) {
			return MusicAllSearchResultParser.parsePlaylistItem(item, client);
		} else if (playEndpoint?.watchPlaylistEndpoint) {
			// TODO add podcast support, id starts with PL
			if (playEndpoint.watchPlaylistEndpoint.playlistId.startsWith("OL")) {
				return MusicAllSearchResultParser.parseAlbumItem(item, client);
			}
		} else {
			return MusicAllSearchResultParser.parseArtistItem(item, client);
		}
	}

	static parseVideoItem(
		item: YoutubeRawData,
		pageType: string,
		client: MusicClient
	): MusicSongCompact | MusicVideoCompact | undefined {
		// TODO support other types
		if (
			!["MUSIC_VIDEO_TYPE_ATV", "MUSIC_VIDEO_TYPE_UGC", "MUSIC_VIDEO_TYPE_OMV"].includes(
				pageType
			)
		) {
			return;
		}

		const [topColumn, bottomColumn] = item.flexColumns.map(
			(c: YoutubeRawData) => c.musicResponsiveListItemFlexColumnRenderer.text.runs
		);

		const id = topColumn[0].navigationEndpoint.watchEndpoint.videoId;
		const title = topColumn[0].text;
		const duration = getDuration(bottomColumn.at(-1).text) || undefined;
		const thumbnails = new Thumbnails().load(
			item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
		);
		const artists = MusicAllSearchResultParser.parseArtists(bottomColumn, client);

		if (pageType === "MUSIC_VIDEO_TYPE_ATV") {
			return new MusicSongCompact({
				client,
				id,
				album: MusicAllSearchResultParser.parseAlbum(bottomColumn, client),
				title,
				artists,
				thumbnails,
				duration,
			});
		} else if (pageType === "MUSIC_VIDEO_TYPE_UGC" || pageType === "MUSIC_VIDEO_TYPE_OMV") {
			return new MusicVideoCompact({ client, id, title, artists, thumbnails, duration });
		}
	}

	private static parsePlaylistItem(item: YoutubeRawData, client: MusicClient) {
		const [topColumn, bottomColumn] = item.flexColumns.map(
			(c: YoutubeRawData) => c.musicResponsiveListItemFlexColumnRenderer.text.runs
		);

		const id =
			item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
				.playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
		const title = topColumn[0].text;
		const songCount = stripToInt(bottomColumn.at(-1).text) || undefined;
		const thumbnails = new Thumbnails().load(
			item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
		);
		const channel = MusicAllSearchResultParser.parseChannel(bottomColumn, client);

		return new MusicPlaylistCompact({ client, id, title, thumbnails, songCount, channel });
	}

	private static parseAlbumItem(item: YoutubeRawData, client: MusicClient) {
		const [topColumn, bottomColumn] = item.flexColumns.map(
			(c: YoutubeRawData) => c.musicResponsiveListItemFlexColumnRenderer.text.runs
		);

		const id =
			item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
				.playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
		const title = topColumn[0].text;
		const year = stripToInt(bottomColumn.at(-1).text) || undefined;
		const thumbnails = new Thumbnails().load(
			item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
		);
		const artists = MusicAllSearchResultParser.parseArtists(bottomColumn, client);

		return new MusicAlbumCompact({ client, id, title, thumbnails, artists, year });
	}

	private static parseArtistItem(item: YoutubeRawData, client: MusicClient) {
		const [topColumn] = item.flexColumns.map(
			(c: YoutubeRawData) => c.musicResponsiveListItemFlexColumnRenderer.text.runs
		);

		const id = item.navigationEndpoint.browseEndpoint.browseId;
		const name = topColumn[0].text;
		const thumbnails = new Thumbnails().load(
			item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
		);

		return new MusicArtistCompact({ client, id, name, thumbnails });
	}

	private static parseAlbum(items: YoutubeRawData, client: MusicClient) {
		const albumRaw = items.find((r: YoutubeRawData) => {
			const pageType =
				r.navigationEndpoint?.browseEndpoint.browseEndpointContextSupportedConfigs
					.browseEndpointContextMusicConfig.pageType;

			return pageType === "MUSIC_PAGE_TYPE_ALBUM";
		});

		if (!albumRaw) return;

		const album = new MusicAlbumCompact({
			client,
			title: albumRaw.text,
			id: albumRaw.navigationEndpoint?.browseEndpoint.browseId,
		});

		return album;
	}

	private static parseArtists(items: YoutubeRawData, client: MusicClient) {
		return this.parseArtistsOrChannel(items).map(
			(r: YoutubeRawData) =>
				new MusicBaseArtist({
					client,
					name: r.text,
					id: r.navigationEndpoint?.browseEndpoint.browseId,
				})
		);
	}

	private static parseChannel(items: YoutubeRawData, client: MusicClient) {
		const [channelRaw] = this.parseArtistsOrChannel(items);

		if (!channelRaw) return;

		const channel = new MusicBaseChannel({
			client,
			name: channelRaw.text,
			id: channelRaw.navigationEndpoint?.browseEndpoint.browseId,
		});

		return channel;
	}

	private static parseArtistsOrChannel(items: YoutubeRawData) {
		return items.filter((i: YoutubeRawData) => {
			const pageType =
				i.navigationEndpoint?.browseEndpoint.browseEndpointContextSupportedConfigs
					.browseEndpointContextMusicConfig.pageType;

			return (
				pageType === "MUSIC_PAGE_TYPE_ARTIST" || pageType == "MUSIC_PAGE_TYPE_USER_CHANNEL"
			);
		});
	}
}
