"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicSearchResultParser = void 0;
const common_1 = require("../../common");
const MusicAlbumCompact_1 = require("../MusicAlbumCompact");
const MusicArtistCompact_1 = require("../MusicArtistCompact");
const MusicBaseArtist_1 = require("../MusicBaseArtist");
const MusicBaseChannel_1 = require("../MusicBaseChannel");
const MusicPlaylistCompact_1 = require("../MusicPlaylistCompact");
const MusicSongCompact_1 = require("../MusicSongCompact");
const MusicVideoCompact_1 = require("../MusicVideoCompact");
class MusicSearchResultParser {
    static parseSearchResult(data, client) {
        const sectionListContents = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        const shelves = sectionListContents
            .filter((f) => f.musicShelfRenderer)
            .map((m) => m.musicShelfRenderer);
        return shelves.map((m) => ({
            title: m.title.runs.map((r) => r.text).join(),
            items: m.contents.map((c) => MusicSearchResultParser.parseSearchItem(c, client)),
        }));
    }
    static parseSearchItem(content, client) {
        var _a;
        const item = content.musicResponsiveListItemRenderer;
        const playEndpoint = (_a = item.overlay) === null || _a === void 0 ? void 0 : _a.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint;
        if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchEndpoint) {
            const pageType = playEndpoint.watchEndpoint.watchEndpointMusicSupportedConfigs
                .watchEndpointMusicConfig.musicVideoType;
            return MusicSearchResultParser.parseVideoItem(item, pageType, client);
        }
        else if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchPlaylistEndpoint.params) {
            return MusicSearchResultParser.parsePlaylistItem(item, client);
        }
        else if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchPlaylistEndpoint) {
            return MusicSearchResultParser.parseAlbumItem(item, client);
        }
        else {
            return MusicSearchResultParser.parseArtistItem(item, client);
        }
    }
    static parseVideoItem(item, pageType, client) {
        const [topColumn, bottomColumn] = item.flexColumns.map((c) => c.musicResponsiveListItemFlexColumnRenderer.text.runs);
        const id = topColumn[0].navigationEndpoint.watchEndpoint.videoId;
        const title = topColumn[0].text;
        const duration = common_1.getDuration(bottomColumn.at(-1).text) || undefined;
        const thumbnails = new common_1.Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        const artists = MusicSearchResultParser.parseArtists(bottomColumn, client);
        if (pageType === "MUSIC_VIDEO_TYPE_ATV") {
            const rawAlbum = bottomColumn.find((r) => {
                var _a;
                return ((_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType) === "MUSIC_PAGE_TYPE_ALBUM";
            });
            const album = rawAlbum
                ? new MusicAlbumCompact_1.MusicAlbumCompact({
                    client,
                    id: rawAlbum.navigationEndpoint.browseEndpoint.browseId,
                    title: rawAlbum.text,
                })
                : undefined;
            return new MusicSongCompact_1.MusicSongCompact({
                client,
                id,
                album,
                title,
                artists,
                thumbnails,
                duration,
            });
        }
        else {
            return new MusicVideoCompact_1.MusicVideoCompact({ client, id, title, artists, thumbnails, duration });
        }
    }
    static parsePlaylistItem(item, client) {
        const [topColumn, bottomColumn] = item.flexColumns.map((c) => c.musicResponsiveListItemFlexColumnRenderer.text.runs);
        const id = item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
            .playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
        const title = topColumn[0].text;
        const songCount = common_1.stripToInt(bottomColumn.at(-1).text) || undefined;
        const thumbnails = new common_1.Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        const channel = MusicSearchResultParser.parseChannel(bottomColumn, client);
        return new MusicPlaylistCompact_1.MusicPlaylistCompact({ client, id, title, thumbnails, songCount, channel });
    }
    static parseAlbumItem(item, client) {
        const [topColumn, bottomColumn] = item.flexColumns.map((c) => c.musicResponsiveListItemFlexColumnRenderer.text.runs);
        const id = item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
            .playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
        const title = topColumn[0].text;
        const year = common_1.stripToInt(bottomColumn.at(-1).text) || undefined;
        const thumbnails = new common_1.Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        const artists = MusicSearchResultParser.parseArtists(bottomColumn, client);
        return new MusicAlbumCompact_1.MusicAlbumCompact({ client, id, title, thumbnails, artists, year });
    }
    static parseArtistItem(item, client) {
        const [topColumn] = item.flexColumns.map((c) => c.musicResponsiveListItemFlexColumnRenderer.text.runs);
        const id = item.navigationEndpoint.browseEndpoint.browseId;
        const name = topColumn[0].text;
        const thumbnails = new common_1.Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        return new MusicArtistCompact_1.MusicArtistCompact({ client, id, name, thumbnails });
    }
    static parseArtists(items, client) {
        return this.parseArtistOrChannel(items).map((r) => new MusicBaseArtist_1.MusicBaseArtist({
            client,
            name: r.text,
            id: r.navigationEndpoint.browseEndpoint.browseId,
        }));
    }
    static parseChannel(items, client) {
        const [channel] = this.parseArtistOrChannel(items).map((r) => new MusicBaseChannel_1.MusicBaseChannel({
            client,
            name: r.text,
            id: r.navigationEndpoint.browseEndpoint.browseId,
        }));
        return channel;
    }
    static parseArtistOrChannel(items) {
        return items.filter((r) => {
            var _a;
            const pageType = (_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
            return (pageType === "MUSIC_PAGE_TYPE_ARTIST" || pageType === "MUSIC_PAGE_TYPE_USER_CHANNEL");
        });
    }
}
exports.MusicSearchResultParser = MusicSearchResultParser;
