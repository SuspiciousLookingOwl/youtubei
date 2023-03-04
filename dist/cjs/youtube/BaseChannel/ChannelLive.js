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
exports.ChannelLive = void 0;
const common_1 = require("../../common");
const Continuable_1 = require("../Continuable");
const VideoCompact_1 = require("../VideoCompact");
const constants_1 = require("../constants");
const BaseChannelParser_1 = require("./BaseChannelParser");
/**
 * {@link Continuable} of videos inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.live.next();
 * console.log(channel.live.items) // first 30 live videos
 *
 * let newVideos = await channel.videos.next();
 * console.log(newVideos) // 30 loaded videos
 * console.log(channel.live.items) // first 60 live videos
 *
 * await channel.live.next(0); // load the rest of the videos in the channel
 * ```
 */
class ChannelLive extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ client, channel }) {
        super({ client, strictContinuationCheck: true });
        this.channel = channel;
    }
    fetch() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = BaseChannelParser_1.BaseChannelParser.TAB_TYPE_PARAMS.live;
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/browse`, {
                data: { browseId: (_a = this.channel) === null || _a === void 0 ? void 0 : _a.id, params, continuation: this.continuation },
            });
            const items = BaseChannelParser_1.BaseChannelParser.parseTabData("live", response.data);
            const continuation = common_1.getContinuationFromItems(items);
            const data = common_1.mapFilter(items, "videoRenderer");
            return {
                continuation,
                items: data.map((i) => new VideoCompact_1.VideoCompact({ client: this.client, channel: this.channel }).load(i)),
            };
        });
    }
}
exports.ChannelLive = ChannelLive;
