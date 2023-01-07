"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transcript = void 0;
const TranscriptParser_1 = require("./TranscriptParser");
/**
 * Represent a single video transcript entry
 */
class Transcript {
    /** @hidden */
    constructor(attr) {
        Object.assign(this, attr);
    }
    /** transcript end time in miliseconds */
    get end() {
        return this.start + this.duration;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        TranscriptParser_1.TranscriptParser.loadTranscript(this, data);
        return this;
    }
}
exports.Transcript = Transcript;
