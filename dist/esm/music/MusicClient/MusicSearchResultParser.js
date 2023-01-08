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
var MusicSearchResultParser = /** @class */ (function () {
    function MusicSearchResultParser() {
    }
    MusicSearchResultParser.parseSearchResult = function (data, client) {
        var sectionListContents = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        var shelves = sectionListContents
            .filter(function (f) { return f.musicShelfRenderer; })
            .map(function (m) { return m.musicShelfRenderer; });
        return shelves.map(function (m) { return ({
            title: m.title.runs.map(function (r) { return r.text; }).join(),
            items: m.contents.map(function (c) {
                return MusicSearchResultParser.parseSearchItem(c, client);
            }),
        }); });
    };
    MusicSearchResultParser.parseSearchItem = function (content, client) {
        var _a;
        var item = content.musicResponsiveListItemRenderer;
        var playEndpoint = (_a = item.overlay) === null || _a === void 0 ? void 0 : _a.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint;
        if (playEndpoint === null || playEndpoint === void 0 ? void 0 : playEndpoint.watchEndpoint) {
            var pageType = playEndpoint.watchEndpoint.watchEndpointMusicSupportedConfigs
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
    };
    MusicSearchResultParser.parseVideoItem = function (item, pageType, client) {
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 2), topColumn = _a[0], bottomColumn = _a[1];
        var id = topColumn[0].navigationEndpoint.watchEndpoint.videoId;
        var title = topColumn[0].text;
        var duration = getDuration(bottomColumn.at(-1).text) || undefined;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        var artists = MusicSearchResultParser.parseArtists(bottomColumn, client);
        if (pageType === "MUSIC_VIDEO_TYPE_ATV") {
            var rawAlbum = bottomColumn.find(function (r) {
                var _a;
                return ((_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType) === "MUSIC_PAGE_TYPE_ALBUM";
            });
            var album = rawAlbum
                ? new MusicAlbumCompact({
                    client: client,
                    id: rawAlbum.navigationEndpoint.browseEndpoint.browseId,
                    title: rawAlbum.text,
                })
                : undefined;
            return new MusicSongCompact({
                client: client,
                id: id,
                album: album,
                title: title,
                artists: artists,
                thumbnails: thumbnails,
                duration: duration,
            });
        }
        else {
            return new MusicVideoCompact({ client: client, id: id, title: title, artists: artists, thumbnails: thumbnails, duration: duration });
        }
    };
    MusicSearchResultParser.parsePlaylistItem = function (item, client) {
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 2), topColumn = _a[0], bottomColumn = _a[1];
        var id = item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
            .playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
        var title = topColumn[0].text;
        var songCount = stripToInt(bottomColumn.at(-1).text) || undefined;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        var channel = MusicSearchResultParser.parseChannel(bottomColumn, client);
        return new MusicPlaylistCompact({ client: client, id: id, title: title, thumbnails: thumbnails, songCount: songCount, channel: channel });
    };
    MusicSearchResultParser.parseAlbumItem = function (item, client) {
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 2), topColumn = _a[0], bottomColumn = _a[1];
        var id = item.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer
            .playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
        var title = topColumn[0].text;
        var year = stripToInt(bottomColumn.at(-1).text) || undefined;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        var artists = MusicSearchResultParser.parseArtists(bottomColumn, client);
        return new MusicAlbumCompact({ client: client, id: id, title: title, thumbnails: thumbnails, artists: artists, year: year });
    };
    MusicSearchResultParser.parseArtistItem = function (item, client) {
        var _a = __read(item.flexColumns.map(function (c) { return c.musicResponsiveListItemFlexColumnRenderer.text.runs; }), 1), topColumn = _a[0];
        var id = item.navigationEndpoint.browseEndpoint.browseId;
        var name = topColumn[0].text;
        var thumbnails = new Thumbnails().load(item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails);
        return new MusicArtistCompact({ client: client, id: id, name: name, thumbnails: thumbnails });
    };
    MusicSearchResultParser.parseArtists = function (items, client) {
        return this.parseArtistOrChannel(items).map(function (r) {
            return new MusicBaseArtist({
                client: client,
                name: r.text,
                id: r.navigationEndpoint.browseEndpoint.browseId,
            });
        });
    };
    MusicSearchResultParser.parseChannel = function (items, client) {
        var _a = __read(this.parseArtistOrChannel(items).map(function (r) {
            return new MusicBaseChannel({
                client: client,
                name: r.text,
                id: r.navigationEndpoint.browseEndpoint.browseId,
            });
        }), 1), channel = _a[0];
        return channel;
    };
    MusicSearchResultParser.parseArtistOrChannel = function (items) {
        return items.filter(function (r) {
            var _a;
            var pageType = (_a = r.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
            return (pageType === "MUSIC_PAGE_TYPE_ARTIST" || pageType === "MUSIC_PAGE_TYPE_USER_CHANNEL");
        });
    };
    return MusicSearchResultParser;
}());
export { MusicSearchResultParser };
