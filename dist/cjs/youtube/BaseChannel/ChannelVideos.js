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
exports.ChannelVideos = void 0;
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
 * await channel.videos.next();
 * console.log(channel.videos.items) // first 30 videos
 *
 * let newVideos = await channel.videos.next();
 * console.log(newVideos) // 30 loaded videos
 * console.log(channel.videos.items) // first 60 videos
 *
 * await channel.videos.next(0); // load the rest of the videos in the channel
 * ```
 */
class ChannelVideos extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ client, channel }) {
        super({ client, strictContinuationCheck: true });
        this.channel = channel;
    }
    fetch() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = BaseChannelParser_1.BaseChannelParser.TAB_TYPE_PARAMS.videos;
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/browse`, {
                data: { browseId: (_a = this.channel) === null || _a === void 0 ? void 0 : _a.id, params, continuation: this.continuation },
            });
            const items = BaseChannelParser_1.BaseChannelParser.parseTabData("videos", response.data);
            const continuation = common_1.getContinuationFromItems(items);
            const videoRenderers = common_1.mapFilter(items, "videoRenderer");
            const lockupViewModels = common_1.mapFilter(items, "lockupViewModel");
            const fromVideoRenderer = videoRenderers.map((i) => new VideoCompact_1.VideoCompact({ client: this.client, channel: this.channel }).load(i));
            const fromLockup = lockupViewModels.map((i) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                const v = new VideoCompact_1.VideoCompact({ client: this.client, channel: this.channel });
                v.id = i.contentId;
                v.title = (_c = (_b = (_a = i.metadata) === null || _a === void 0 ? void 0 : _a.lockupMetadataViewModel) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c.content;
                v.thumbnails = new common_1.Thumbnails().load(((_f = (_e = (_d = i.contentImage) === null || _d === void 0 ? void 0 : _d.thumbnailViewModel) === null || _e === void 0 ? void 0 : _e.image) === null || _f === void 0 ? void 0 : _f.sources) || []);
                const overlays = ((_j = (_h = (_g = i.contentImage) === null || _g === void 0 ? void 0 : _g.thumbnailViewModel) === null || _h === void 0 ? void 0 : _h.overlays) === null || _j === void 0 ? void 0 : _j[0]) || {};
                const badges = ((_k = overlays.thumbnailBottomOverlayViewModel) === null || _k === void 0 ? void 0 : _k.badges) || [];
                const badgeText = ((_m = (_l = badges[0]) === null || _l === void 0 ? void 0 : _l.thumbnailBadgeViewModel) === null || _m === void 0 ? void 0 : _m.text) || "";
                v.isLive = badgeText === "LIVE";
                v.duration = !v.isLive && badgeText ? common_1.getDuration(badgeText) : null;
                const metaRows = ((_r = (_q = (_p = (_o = i.metadata) === null || _o === void 0 ? void 0 : _o.lockupMetadataViewModel) === null || _p === void 0 ? void 0 : _p.metadata) === null || _q === void 0 ? void 0 : _q.contentMetadataViewModel) === null || _r === void 0 ? void 0 : _r.metadataRows) || [];
                const metaText = ((_v = (_u = (_t = (_s = metaRows[0]) === null || _s === void 0 ? void 0 : _s.metadataParts) === null || _t === void 0 ? void 0 : _t[0]) === null || _u === void 0 ? void 0 : _u.text) === null || _v === void 0 ? void 0 : _v.content) || "";
                v.viewCount = common_1.stripToInt(metaText);
                return v;
            });
            return {
                continuation,
                items: [...fromVideoRenderer, ...fromLockup],
            };
        });
    }
}
exports.ChannelVideos = ChannelVideos;
