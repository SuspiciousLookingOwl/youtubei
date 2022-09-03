"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const Base_1 = require("../Base");
const PlaylistParser_1 = require("./PlaylistParser");
const PlaylistVideos_1 = require("./PlaylistVideos");
/** Represents a Playlist, usually returned from `client.getPlaylist()` */
class Playlist extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
        this.videos = new PlaylistVideos_1.PlaylistVideos({ client: attr.client, playlist: this });
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        PlaylistParser_1.PlaylistParser.loadPlaylist(this, data);
        return this;
    }
}
exports.Playlist = Playlist;
