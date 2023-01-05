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
exports.PlaylistVideos = void 0;
const Continuable_1 = require("../Continuable");
const constants_1 = require("../constants");
const PlaylistParser_1 = require("./PlaylistParser");
/**
 * {@link Continuable} of videos inside a {@link Playlist}
 *
 * @example
 * ```js
 * const playlist = await youtube.getPlaylist(PLAYLIST_ID);
 * console.log(playlist.videos) // first 100 videos
 *
 * let newVideos = await playlist.videos.next();
 * console.log(newVideos) // 100 loaded videos
 * console.log(playlist.videos) // first 200 videos
 *
 * await playlist.videos.next(0); // load the rest of the videos in the playlist
 * ```
 *
 * @param count How many times to load the next videos. Set 0 to load all videos (might take a while on a large playlist!)
 */
class PlaylistVideos extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ client, playlist }) {
        super({ client, strictContinuationCheck: true });
        this.playlist = playlist;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/browse`, {
                data: { continuation: this.continuation },
            });
            const items = PlaylistParser_1.PlaylistParser.parseContinuationVideos(response.data, this.client);
            const continuation = PlaylistParser_1.PlaylistParser.parseVideoContinuation(response.data);
            return { continuation, items };
        });
    }
}
exports.PlaylistVideos = PlaylistVideos;
