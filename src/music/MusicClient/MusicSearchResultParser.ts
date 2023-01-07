import { getDuration, Shelf, stripToInt, Thumbnails, YoutubeRawData } from "../../common";
import { MusicAlbumCompact } from "../MusicAlbumCompact";
import { MusicArtistCompact } from "../MusicArtistCompact";
import { MusicBaseArtist } from "../MusicBaseArtist";
import { MusicBaseChannel } from "../MusicBaseChannel";
import { MusicPlaylistCompact } from "../MusicPlaylistCompact";
import { MusicSongCompact } from "../MusicSongCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
import { MusicClient } from "./MusicClient";

export class MusicSearchResultParser {
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
			items: m.contents.map((c: YoutubeRawData) =>
				MusicSearchResultParser.parseSearchItem(c, client)
			),
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

			return MusicSearchResultParser.parseVideoItem(item, pageType, client);
		} else if (playEndpoint?.watchPlaylistEndpoint.params) {
			return MusicSearchResultParser.parsePlaylistItem(item, client);
		} else if (playEndpoint?.watchPlaylistEndpoint) {
			return MusicSearchResultParser.parseAlbumItem(item, client);
		} else {
			return MusicSearchResultParser.parseArtistItem(item, client);
		}
	}

	private static parseVideoItem(item: YoutubeRawData, pageType: string, client: MusicClient) {
		const [topColumn, bottomColumn] = item.flexColumns.map(
			(c: YoutubeRawData) => c.musicResponsiveListItemFlexColumnRenderer.text.runs
		);

		const id = topColumn[0].navigationEndpoint.watchEndpoint.videoId;
		const title = topColumn[0].text;
		const duration = getDuration(bottomColumn.at(-1).text) || undefined;
		const thumbnails = new Thumbnails().load(
			item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
		);
		const artists = MusicSearchResultParser.parseArtists(bottomColumn, client);

		if (pageType === "MUSIC_VIDEO_TYPE_ATV") {
			const rawAlbum = bottomColumn.find(
				(r: YoutubeRawData) =>
					r.navigationEndpoint?.browseEndpoint.browseEndpointContextSupportedConfigs
						.browseEndpointContextMusicConfig.pageType === "MUSIC_PAGE_TYPE_ALBUM"
			);

			const album = rawAlbum
				? new MusicAlbumCompact({
						client,
						id: rawAlbum.navigationEndpoint.browseEndpoint.browseId,
						title: rawAlbum.text,
				  })
				: undefined;

			return new MusicSongCompact({
				client,
				id,
				album,
				title,
				artists,
				thumbnails,
				duration,
			});
		} else {
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
		const channel = MusicSearchResultParser.parseChannel(bottomColumn, client);

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
		const artists = MusicSearchResultParser.parseArtists(bottomColumn, client);

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

	private static parseArtists(items: YoutubeRawData, client: MusicClient) {
		return this.parseArtistOrChannel(items).map(
			(r: YoutubeRawData) =>
				new MusicBaseArtist({
					client,
					name: r.text,
					id: r.navigationEndpoint.browseEndpoint.browseId,
				})
		);
	}

	private static parseChannel(items: YoutubeRawData, client: MusicClient) {
		const [channel] = this.parseArtistOrChannel(items).map(
			(r: YoutubeRawData) =>
				new MusicBaseChannel({
					client,
					name: r.text,
					id: r.navigationEndpoint.browseEndpoint.browseId,
				})
		);
		return channel;
	}

	private static parseArtistOrChannel(items: YoutubeRawData) {
		return items.filter((r: YoutubeRawData) => {
			const pageType =
				r.navigationEndpoint?.browseEndpoint.browseEndpointContextSupportedConfigs
					.browseEndpointContextMusicConfig.pageType;

			return (
				pageType === "MUSIC_PAGE_TYPE_ARTIST" || pageType === "MUSIC_PAGE_TYPE_USER_CHANNEL"
			);
		});
	}
}
