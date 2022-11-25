"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptParser = void 0;
class TranscriptParser {
    static loadTranscript(target, data) {
        const { cue, startOffsetMs, durationMs } = data;
        target.text = cue.simpleText;
        target.duration = +durationMs;
        target.start = +startOffsetMs;
        return target;
    }
}
exports.TranscriptParser = TranscriptParser;
