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
exports.Video = void 0;
const BaseVideo_1 = require("../BaseVideo");
const VideoComments_1 = require("./VideoComments");
const VideoParser_1 = require("./VideoParser");
/** Represents a Video, usually returned from `client.getVideo()`  */
class Video extends BaseVideo_1.BaseVideo {
    /** @hidden */
    constructor(attr) {
        super(attr);
        Object.assign(this, attr);
        this.comments = new VideoComments_1.VideoComments({ client: attr.client, video: this });
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        super.load(data);
        VideoParser_1.VideoParser.loadVideo(this, data);
        return this;
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
exports.Video = Video;
