import { BaseVideoParser } from "../BaseVideo";
var LiveVideoParser = /** @class */ (function () {
    function LiveVideoParser() {
    }
    LiveVideoParser.loadLiveVideo = function (target, data) {
        var _a;
        var videoInfo = BaseVideoParser.parseRawData(data);
        target.watchingCount = +videoInfo.viewCount.videoViewCountRenderer.viewCount.runs
            .map(function (r) { return r.text; })
            .join(" ")
            .replace(/[^0-9]/g, "");
        target.chatContinuation = (_a = data[3].response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer) === null || _a === void 0 ? void 0 : _a.continuations[0].reloadContinuationData.continuation;
        return target;
    };
    LiveVideoParser.parseChats = function (data) {
        var _a;
        return (((_a = data.continuationContents.liveChatContinuation.actions) === null || _a === void 0 ? void 0 : _a.flatMap(function (a) { var _a; return ((_a = a.addChatItemAction) === null || _a === void 0 ? void 0 : _a.item.liveChatTextMessageRenderer) || []; })) || []);
    };
    LiveVideoParser.parseContinuation = function (data) {
        var continuation = data.continuationContents.liveChatContinuation.continuations[0];
        var continuationData = continuation.timedContinuationData || continuation.invalidationContinuationData;
        return {
            timeout: continuationData.timeoutMs,
            continuation: continuationData.continuation,
        };
    };
    return LiveVideoParser;
}());
export { LiveVideoParser };
