"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveVideoParser = void 0;
const BaseVideo_1 = require("../BaseVideo");
class LiveVideoParser {
    static loadLiveVideo(target, data) {
        var _a;
        const videoInfo = BaseVideo_1.BaseVideoParser.parseRawData(data);
        target.watchingCount = +videoInfo.viewCount.videoViewCountRenderer.viewCount.runs
            .map((r) => r.text)
            .join(" ")
            .replace(/[^0-9]/g, "");
        target.chatContinuation = (_a = data[3].response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer) === null || _a === void 0 ? void 0 : _a.continuations[0].reloadContinuationData.continuation;
        return target;
    }
    static parseChats(data) {
        var _a;
        return (((_a = data.continuationContents.liveChatContinuation.actions) === null || _a === void 0 ? void 0 : _a.flatMap((a) => { var _a; return ((_a = a.addChatItemAction) === null || _a === void 0 ? void 0 : _a.item.liveChatTextMessageRenderer) || []; })) || []);
    }
    static parseContinuation(data) {
        const continuation = data.continuationContents.liveChatContinuation.continuations[0];
        const continuationData = continuation.timedContinuationData || continuation.invalidationContinuationData;
        return {
            timeout: continuationData.timeoutMs,
            continuation: continuationData.continuation,
        };
    }
}
exports.LiveVideoParser = LiveVideoParser;
