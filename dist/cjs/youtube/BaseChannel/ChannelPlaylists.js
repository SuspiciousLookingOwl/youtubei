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
exports.ChannelPlaylists = void 0;
const common_1 = require("../../common");
const Continuable_1 = require("../Continuable");
const PlaylistCompact_1 = require("../PlaylistCompact");
const constants_1 = require("../constants");
const BaseChannelParser_1 = require("./BaseChannelParser");
/**
 * {@link Continuable} of playlists inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.playlists.next();
 * console.log(channel.playlists.items) // first 30 playlists
 *
 * let newPlaylists = await channel.playlists.next();
 * console.log(newPlaylists) // 30 loaded playlists
 * console.log(channel.playlists.items) // first 60 playlists
 *
 * await channel.playlists.next(0); // load the rest of the playlists in the channel
 * ```
 */
class ChannelPlaylists extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ client, channel }) {
        super({ client, strictContinuationCheck: true });
        this.channel = channel;
    }
    fetch() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = "EglwbGF5bGlzdHMgAQ%3D%3D";
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/browse`, {
                data: { browseId: (_a = this.channel) === null || _a === void 0 ? void 0 : _a.id, params, continuation: this.continuation },
            });
            const items = BaseChannelParser_1.BaseChannelParser.parseTabData("playlists", response.data);
            const continuation = common_1.getContinuationFromItems(items);
            const data = common_1.mapFilter(items, "gridPlaylistRenderer");
            return {
                continuation,
                items: data.map((i) => new PlaylistCompact_1.PlaylistCompact({ client: this.client, channel: this.channel }).load(i)),
            };
        });
    }
}
exports.ChannelPlaylists = ChannelPlaylists;
