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
exports.VideoComments = void 0;
const Continuable_1 = require("../Continuable");
const constants_1 = require("../constants");
const VideoParser_1 = require("./VideoParser");
/**
 * {@link Continuable} of videos inside a {@link Video}
 *
 * @example
 * ```js
 * const video = await youtube.getVideo(VIDEO_ID);
 * await video.comments.next();
 * console.log(video.comments) // first 20 comments
 *
 * let newComments = await video.comments.next();
 * console.log(newComments) // 20 loaded comments
 * console.log(video.comments) // first 40 comments
 *
 * await video.comments.next(0); // load the rest of the comments in the video
 * ```
 *
 * @param count How many times to load the next comments. Set 0 to load all comments (might take a while on a video with many  comments!)
 *
 * @returns Loaded comments
 */
class VideoComments extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ client, video }) {
        super({ client, strictContinuationCheck: true });
        this.video = video;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/next`, {
                data: { continuation: this.continuation },
            });
            const items = VideoParser_1.VideoParser.parseComments(response.data, this.video);
            const continuation = VideoParser_1.VideoParser.parseCommentContinuation(response.data);
            return { continuation, items };
        });
    }
}
exports.VideoComments = VideoComments;
