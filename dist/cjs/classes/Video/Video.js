"use strict";
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
}
exports.Video = Video;
