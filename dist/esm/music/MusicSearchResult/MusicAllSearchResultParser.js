var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { getDuration, stripToInt, Thumbnails } from "../../common";
import { MusicAlbumCompact } from "../MusicAlbumCompact";
import { MusicArtistCompact } from "../MusicArtistCompact";
import { MusicBaseArtist } from "../MusicBaseArtist";
import { MusicBaseChannel } from "../MusicBaseChannel";
import { MusicPlaylistCompact } from "../MusicPlaylistCompact";
import { MusicSongCompact } from "../MusicSongCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
var MusicAllSearchResultParser = /** @class */ (function () {
    function MusicAllSearchResultParser() {
    }
    MusicAllSearchResultParser.parseTopResult = function (data, client) {
        var _a;
        var sectionListContents = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        var top = (_a = sectionListContents.find(function (f) { return f.musicCardShelfRenderer; })) === null || _a === void 0 ? void 0 : _a.musicCardShelfRenderer;
        if (!top)
            return;
        var _b = top.title.runs[0].navigationEndpoint, browseEndpoint = _b.browseEndpoint, watchEndpoint = _b.watchEndpoint;
        var id = (watchEndpoint === null || watchEndpoint === void 0 ? void 0 : watchEndpoint.videoId) || (browseEndpoint === null || browseEndpoint === void 0 ? void 0 : browseEndpoint.browseId);
        var type = (watchEndpoint === null || watchEndpoint === void 0 ? void 0 : watchEndpoint.watchEndpointMusicSupportedConfigs.watchEndpointMusicConfig.musicVideoType) || (browseEndpoint === null || browseEndpoint === void 0 ? void 0 : browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType);
        var title = top.title.runs[0].text;
        var thumbnail = top.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
        var topResult;
        if (type === "MUSIC_VIDEO_TYPE_ATV") {
            topResult = new MusicSongCompact({
                client: client,
                id: id,
                title: title,
                duration: getDuration(top.subtitle.runs.at(-1).text),
                artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
                album: MusicAllSearchResultParser.parseAlbum(top.subtitle.runs, client),
                thumbnails: new Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_VIDEO_TYPE_UGC" || type === "MUSIC_VIDEO_TYPE_OMV") {
            topResult = new MusicVideoCompact({
                client: client,
                id: id,
                title: title,
                duration: getDuration(top.subtitle.runs.at(-1).text),
                artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
                thumbnails: new Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_PAGE_TYPE_ALBUM") {
            topResult = new MusicAlbumCompact({
                client: client,
                id: id,
                title: title,
                artists: MusicAllSearchResultParser.parseArtists(top.subtitle.runs, client),
                thumbnails: new Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_PAGE_TYPE_ARTIST") {
            topResult = new MusicArtistCompact({
                client: client,
                id: id,
                name: title,
                thumbnails: new Thumbnails().load(thumbnail),
            });
        }
        else if (type === "MUSIC_PAGE_TYPE_PLAYLIST") {
            topResult = new MusicPlaylistCompact({
                client: client,
                id: id,
                title: title,
                channel: MusicAllSearchResultParser.parseChannel(top.subtitle.runs, client),
                thumbnails: new Thumbnails().load(thumbnail),
            });
        }
        var more;
        if (top.contents) {
            more = top.contents
                .filter(function (c) { return c.musicResponsiveListItemRenderer; })
                .map(function (c) { return MusicAllSearchResultParser.parseSearchItem(c, client); });
        }
        return {
            item: topResult,
            more: more,
        };
    };
    MusicAllSearchResultParser.parseSearchResult = function (data, client) {
        var sectionListContents = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        var shelves = sectionListContents
            .filter(function (f) { return f.musicShelfRenderer; })
            .map(function (m) { return m.musicShelfRenderer; });
        return shelves.map(function (m) { return ({
            title: m.title.runs.map(function (r) { return r.text; }).join(),
            items: m.contents
                .map(function (c) { return MusicAllSearchResultParser.parseSearchItem(c, client); })
                .filter(function (i) { return i; }),
        }); });
    };
    MusicAllSearchResultParser.parseSearchItem = function (content, client) {
        var _a;
        var item = content.musicResponsiveListItemRenderer;
        var playEndpoint = (_a = item.overlay) === null || _a === void 0 ? void 0 : _a.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint;
        if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchEndpoint) {
            var pageType = playEndpoint.watchEndpoint.watchEndpointMusicSupportedConfigs
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
    };
    MusicAllSearchResultParser.parseVideoItem = function (item, pageType, client) {
        // TODO support other types
        if (!["MUSIC_VIDEO_TYPE_ATV", "MUSIC_VIDEO_TYPE_UGC", "MUSIC_VIDEO_TYPE_OMV"].includes(pageType)) {
            return;
        }
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 2), topColumn = _a[0], bottomColumn = _a[1];
        var id = topColumn[0].navigationEndpoint.watchEndpoint.videoId;
        var title = topColumn[0].text;
        var duration = getDuration(bottomColumn.at(-1).text) || undefined;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        var artists = MusicAllSearchResultParser.parseArtists(bottomColumn, client);
        if (pageType === "MUSIC_VIDEO_TYPE_ATV") {
            return new MusicSongCompact({
                client: client,
                id: id,
                album: MusicAllSearchResultParser.parseAlbum(bottomColumn, client),
                title: title,
                artists: artists,
                thumbnails: thumbnails,
                duration: duration,
            });
        }
        else if (pageType === "MUSIC_VIDEO_TYPE_UGC" || pageType === "MUSIC_VIDEO_TYPE_OMV") {
            return new MusicVideoCompact({ client: client, id: id, title: title, artists: artists, thumbnails: thumbnails, duration: duration });
        }
    };
    MusicAllSearchResultParser.parsePlaylistItem = function (item, client) {
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 2), topColumn = _a[0], bottomColumn = _a[1];
        var id = item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
            .playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
        var title = topColumn[0].text;
        var songCount = stripToInt(bottomColumn.at(-1).text) || undefined;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        var channel = MusicAllSearchResultParser.parseChannel(bottomColumn, client);
        return new MusicPlaylistCompact({ client: client, id: id, title: title, thumbnails: thumbnails, songCount: songCount, channel: channel });
    };
    MusicAllSearchResultParser.parseAlbumItem = function (item, client) {
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 2), topColumn = _a[0], bottomColumn = _a[1];
        var id = item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
            .playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
        var title = topColumn[0].text;
        var year = stripToInt(bottomColumn.at(-1).text) || undefined;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        var artists = MusicAllSearchResultParser.parseArtists(bottomColumn, client);
        return new MusicAlbumCompact({ client: client, id: id, title: title, thumbnails: thumbnails, artists: artists, year: year });
    };
    MusicAllSearchResultParser.parseArtistItem = function (item, client) {
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 1), topColumn = _a[0];
        var id = item.navigationEndpoint.browseEndpoint.browseId;
        var name = topColumn[0].text;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        return new MusicArtistCompact({ client: client, id: id, name: name, thumbnails: thumbnails });
    };
    MusicAllSearchResultParser.parseAlbum = function (items, client) {
        var _a;
        var albumRaw = items.find(function (r) {
            var _a;
            var pageType = (_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
            return pageType === "MUSIC_PAGE_TYPE_ALBUM";
        });
        if (!albumRaw)
            return;
        var album = new MusicAlbumCompact({
            client: client,
            title: albumRaw.text,
            id: (_a = albumRaw.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseId,
        });
        return album;
    };
    MusicAllSearchResultParser.parseArtists = function (items, client) {
        return this.parseArtistsOrChannel(items).map(function (r) {
            var _a;
            return new MusicBaseArtist({
                client: client,
                name: r.text,
                id: (_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseId,
            });
        });
    };
    MusicAllSearchResultParser.parseChannel = function (items, client) {
        var _a;
        var _b = __read(this.parseArtistsOrChannel(items), 1), channelRaw = _b[0];
        if (!channelRaw)
            return;
        var channel = new MusicBaseChannel({
            client: client,
            name: channelRaw.text,
            id: (_a = channelRaw.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseId,
        });
        return channel;
    };
    MusicAllSearchResultParser.parseArtistsOrChannel = function (items) {
        return items.filter(function (i) {
            var _a;
            var pageType = (_a = i.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
            return (pageType === "MUSIC_PAGE_TYPE_ARTIST" || pageType == "MUSIC_PAGE_TYPE_USER_CHANNEL");
        });
    };
    return MusicAllSearchResultParser;
}());
export { MusicAllSearchResultParser };
