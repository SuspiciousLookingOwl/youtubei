var TranscriptParser = /** @class */ (function () {
    function TranscriptParser() {
    }
    TranscriptParser.loadTranscript = function (target, data) {
        var cue = data.cue, startOffsetMs = data.startOffsetMs, durationMs = data.durationMs;
        target.text = cue.simpleText;
        target.duration = +durationMs;
        target.start = +startOffsetMs;
        return target;
    };
    return TranscriptParser;
}());
export { TranscriptParser };
