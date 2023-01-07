"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixPlaylist = void 0;
const Base_1 = require("../Base");
const MixPlaylistParser_1 = require("./MixPlaylistParser");
/** Represents a MixPlaylist, usually returned from `client.getPlaylist()` */
class MixPlaylist extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        /** How many viewers does this playlist have */
        this.videos = [];
        Object.assign(this, attr);
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        MixPlaylistParser_1.MixPlaylistParser.loadMixPlaylist(this, data);
        return this;
    }
}
exports.MixPlaylist = MixPlaylist;
