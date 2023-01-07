import { TranscriptParser } from "./TranscriptParser";
/**
 * Represent a single video transcript entry
 */
var Transcript = /** @class */ (function () {
    /** @hidden */
    function Transcript(attr) {
        Object.assign(this, attr);
    }
    Object.defineProperty(Transcript.prototype, "end", {
        /** transcript end time in miliseconds */
        get: function () {
            return this.start + this.duration;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    Transcript.prototype.load = function (data) {
        TranscriptParser.loadTranscript(this, data);
        return this;
    };
    return Transcript;
}());
export { Transcript };
