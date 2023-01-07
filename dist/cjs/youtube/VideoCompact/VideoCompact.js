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
exports.VideoCompact = void 0;
const Base_1 = require("../Base");
const VideoCompactParser_1 = require("./VideoCompactParser");
/** Represent a compact video (e.g. from search result, playlist's videos, channel's videos) */
class VideoCompact extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
    }
    /** Whether this video is private / deleted or not, only useful in playlist's videos */
    get isPrivateOrDeleted() {
        return !this.duration;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        VideoCompactParser_1.VideoCompactParser.loadVideoCompact(this, data);
        return this;
    }
    /**
     * Get {@link Video} object based on current video id
     *
     * Equivalent to
     * ```js
     * client.getVideo(videoCompact.id);
     * ```
     */
    getVideo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getVideo(this.id);
        });
    }
    /**
     * Get Video transcript (if exists)
     *
     * Equivalent to
     * ```js
     * client.getVideoTranscript(video.id);
     * ```
     */
    getTranscript() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getVideoTranscript(this.id);
        });
    }
}
exports.VideoCompact = VideoCompact;
