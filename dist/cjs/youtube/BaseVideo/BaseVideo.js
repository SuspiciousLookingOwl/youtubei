"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseVideo = void 0;
const Base_1 = require("../Base");
const BaseVideoParser_1 = require("./BaseVideoParser");
const VideoRelated_1 = require("./VideoRelated");
/** Represents a Video  */
class BaseVideo extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
        this.related = new VideoRelated_1.VideoRelated({ client: this.client, video: this });
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        BaseVideoParser_1.BaseVideoParser.loadBaseVideo(this, data);
        return this;
    }
    /**
     * Video / playlist to play next after this video, alias to
     * ```js
     * video.related.items[0]
     * ```
     */
    get upNext() {
        return this.related.items[0];
    }
}
exports.BaseVideo = BaseVideo;
