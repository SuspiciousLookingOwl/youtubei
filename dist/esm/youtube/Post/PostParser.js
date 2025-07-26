import { BaseChannel } from "../BaseChannel";
var PostParser = /** @class */ (function () {
    function PostParser() {
    }
    PostParser.loadPost = function (target, data) {
        var _a, _b, _c, _d;
        var postId = data.postId, authorText = data.authorText, authorThumbnail = data.authorThumbnail, authorEndpoint = data.authorEndpoint, contentText = data.contentText, publishedTimeText = data.publishedTimeText, voteCount = data.voteCount;
        // Basic information
        target.id = postId;
        target.content = (_a = contentText === null || contentText === void 0 ? void 0 : contentText.runs) === null || _a === void 0 ? void 0 : _a.map(function (r) { return r.text; }).join("");
        target.channel = new BaseChannel({
            id: (_b = authorEndpoint === null || authorEndpoint === void 0 ? void 0 : authorEndpoint.browseEndpoint) === null || _b === void 0 ? void 0 : _b.browseId,
            name: (_c = authorText.runs) === null || _c === void 0 ? void 0 : _c[0].text,
            thumbnails: authorThumbnail.thumbnails,
            client: target.client,
        });
        target.timestamp = (_d = publishedTimeText.runs[0]) === null || _d === void 0 ? void 0 : _d.text;
        target.voteCount = voteCount.simpleText;
        return target;
    };
    return PostParser;
}());
export { PostParser };
