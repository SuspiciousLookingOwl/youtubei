"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistCompact = void 0;
const Base_1 = require("../Base");
const PlaylistCompactParser_1 = require("./PlaylistCompactParser");
/** Represents a Compact Playlist (e.g. from search result, related of a video) */
class PlaylistCompact extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        PlaylistCompactParser_1.PlaylistCompactParser.loadPlaylistCompact(this, data);
        return this;
    }
    /**
     * Get {@link Playlist} object based on current playlist id
     *
     * Equivalent to
     * ```js
     * client.getPlaylist(playlistCompact.id);
     * ```
     */
    getPlaylist() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getPlaylist(this.id);
        });
    }
}
exports.PlaylistCompact = PlaylistCompact;
