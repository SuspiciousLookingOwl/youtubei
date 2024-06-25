"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicAllSearchResultParser = void 0;
const common_1 = require("../../common");
const MusicAlbumCompact_1 = require("../MusicAlbumCompact");
const MusicArtistCompact_1 = require("../MusicArtistCompact");
const MusicBaseArtist_1 = require("../MusicBaseArtist");
const MusicBaseChannel_1 = require("../MusicBaseChannel");
const MusicPlaylistCompact_1 = require("../MusicPlaylistCompact");
const MusicSongCompact_1 = require("../MusicSongCompact");
const MusicVideoCompact_1 = require("../MusicVideoCompact");
class MusicAllSearchResultParser {
    static parseTopResult(data, client) {
        var _a;
        const sectionListContents = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        const top = (_a = sectionListContents.find((f) => f.musicCardShelfRenderer)) === null || _a === void 0 ? void 0 : _a.musicCardShelfRenderer;
        if (!top)
            return;
        const { browseEndpoint, watchEndpoint } = top.title.runs[0].navigationEndpoint;
        const id = (watchEndpoint === null || watchEndpoint === void 0 ? void 0 : watchEndpoint.videoId) || (browseEndpoint === null || browseEndpoint === void 0 ? void 0 : browseEndpoint.browseId);
        const type = (watchEndpoint === null || watchEndpoint === void 0 ? void 0 : watchEndpoint.watchEndpointMusicSupportedConfigs.watchEndpointMusicConfig.musicVideoType) || (browseEndpoint === null || browseEndpoint === void 0 ? void 0 : browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType);
        const title = top.title.runs[0].text;
        const thumbnail = top.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
        let topResult;
        if (type === "MUSIC_VIDEO_TYPE_ATV") {
            topResult = new MusicSongCompact_1.MusicSongCompact({
                client,
                id,
                title,
                duration: common_1.getDuration(top.subtitle.runs.at(-1).text),
                artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
                album: MusicAllSearchResultParser.parseAlbum(top.subtitle.runs, client),
                thumbnails: new common_1.Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_VIDEO_TYPE_UGC" || type === "MUSIC_VIDEO_TYPE_OMV") {
            topResult = new MusicVideoCompact_1.MusicVideoCompact({
                client,
                id,
                title,
                duration: common_1.getDuration(top.subtitle.runs.at(-1).text),
                artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
                thumbnails: new common_1.Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_PAGE_TYPE_ALBUM") {
            topResult = new MusicAlbumCompact_1.MusicAlbumCompact({
                client,
                id,
                title,
                artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
                thumbnails: new common_1.Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_PAGE_TYPE_ARTIST") {
            topResult = new MusicArtistCompact_1.MusicArtistCompact({
                client,
                id,
                name: title,
                thumbnails: new common_1.Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_PAGE_TYPE_PLAYLIST") {
            topResult = new MusicPlaylistCompact_1.MusicPlaylistCompact({
                client,
                id,
                title,
                channel: MusicAllSearchResultParser.parseChannel(top.subtitle.runs, client),
                thumbnails: new common_1.Thumbnails().load(thumbnail),
            });
        }
        let more;
        if (top.contents) {
            more = top.contents
                .filter((c) => c.musicResponsiveListItemRenderer)
                .map((c) => MusicAllSearchResultParser.parseSearchItem(c, client));
        }
        return {
            item: topResult,
            more,
        };
    }
    static parseSearchResult(data, client) {
        const sectionListContents = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        const shelves = sectionListContents
            .filter((f) => f.musicShelfRenderer)
            .map((m) => m.musicShelfRenderer);
        return shelves.map((m) => ({
            title: m.title.runs.map((r) => r.text).join(),
            items: m.contents
                .map((c) => MusicAllSearchResultParser.parseSearchItem(c, client))
                .filter((i) => i),
        }));
    }
    static parseSearchItem(content, client) {
        var _a;
        const item = content.musicResponsiveListItemRenderer;
        const playEndpoint = (_a = item.overlay) === null || _a === void 0 ? void 0 : _a.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint;
        if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchEndpoint) {
            const pageType = playEndpoint.watchEndpoint.watchEndpointMusicSupportedConfigs
                .watchEndpointMusicConfig.musicVideoType;
            return MusicAllSearchResultParser.parseVideoItem(item, pageType, client);
        }
        else if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchPlaylistEndpoint.params) {
            return MusicAllSearchResultParser.parsePlaylistItem(item, client);
        }
        else if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchPlaylistEndpoint) {
            // TODO add podcast support, id starts with PL
            if (playEndpoint.watchPlaylistEndpoint.playlistId.startsWith("OL")) {
                return MusicAllSearchResultParser.parseAlbumItem(item, client);
            }
        }
        else {
            return MusicAllSearchResultParser.parseArtistItem(item, client);
        }
    }
    static parseVideoItem(item, pageType, client) {
        // TODO support other types
        if (!["MUSIC_VIDEO_TYPE_ATV", "MUSIC_VIDEO_TYPE_UGC", "MUSIC_VIDEO_TYPE_OMV"].includes(pageType)) {
            return;
        }
        const [topColumn, bottomColumn] = item.flexColumns.map((c) => c.musicResponsiveListItemFlexColumnRenderer.text.runs);
        const id = topColumn[0].navigationEndpoint.watchEndpoint.videoId;
        const title = topColumn[0].text;
        const duration = common_1.getDuration(bottomColumn.at(-1).text) || undefined;
        const thumbnails = new common_1.Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        const artists = MusicAllSearchResultParser.parseArtists(bottomColumn, client);
        if (pageType === "MUSIC_VIDEO_TYPE_ATV") {
            return new MusicSongCompact_1.MusicSongCompact({
                client,
                id,
                album: MusicAllSearchResultParser.parseAlbum(bottomColumn, client),
                title,
                artists,
                thumbnails,
                duration,
            });
        }
        else if (pageType === "MUSIC_VIDEO_TYPE_UGC" || pageType === "MUSIC_VIDEO_TYPE_OMV") {
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
        const channel = MusicAllSearchResultParser.parseChannel(bottomColumn, client);
        return new MusicPlaylistCompact_1.MusicPlaylistCompact({ client, id, title, thumbnails, songCount, channel });
    }
    static parseAlbumItem(item, client) {
        const [topColumn, bottomColumn] = item.flexColumns.map((c) => c.musicResponsiveListItemFlexColumnRenderer.text.runs);
        const id = item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
            .playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
        const title = topColumn[0].text;
        const year = common_1.stripToInt(bottomColumn.at(-1).text) || undefined;
        const thumbnails = new common_1.Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        const artists = MusicAllSearchResultParser.parseArtists(bottomColumn, client);
        return new MusicAlbumCompact_1.MusicAlbumCompact({ client, id, title, thumbnails, artists, year });
    }
    static parseArtistItem(item, client) {
        const [topColumn] = item.flexColumns.map((c) => c.musicResponsiveListItemFlexColumnRenderer.text.runs);
        const id = item.navigationEndpoint.browseEndpoint.browseId;
        const name = topColumn[0].text;
        const thumbnails = new common_1.Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        return new MusicArtistCompact_1.MusicArtistCompact({ client, id, name, thumbnails });
    }
    static parseAlbum(items, client) {
        var _a;
        const albumRaw = items.find((r) => {
            var _a;
            const pageType = (_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
            return pageType === "MUSIC_PAGE_TYPE_ALBUM";
        });
        if (!albumRaw)
            return;
        const album = new MusicAlbumCompact_1.MusicAlbumCompact({
            client,
            title: albumRaw.text,
            id: (_a = albumRaw.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseId,
        });
        return album;
    }
    static parseArtists(items, client) {
        return this.parseArtistsOrChannel(items).map((r) => {
            var _a;
            return new MusicBaseArtist_1.MusicBaseArtist({
                client,
                name: r.text,
                id: (_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseId,
            });
        });
    }
    static parseChannel(items, client) {
        var _a;
        const [channelRaw] = this.parseArtistsOrChannel(items);
        if (!channelRaw)
            return;
        const channel = new MusicBaseChannel_1.MusicBaseChannel({
            client,
            name: channelRaw.text,
            id: (_a = channelRaw.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseId,
        });
        return channel;
    }
    static parseArtistsOrChannel(items) {
        return items.filter((i) => {
            var _a;
            const pageType = (_a = i.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
            return (pageType === "MUSIC_PAGE_TYPE_ARTIST" || pageType == "MUSIC_PAGE_TYPE_USER_CHANNEL");
        });
    }
}
exports.MusicAllSearchResultParser = MusicAllSearchResultParser;
