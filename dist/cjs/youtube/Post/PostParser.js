"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostParser = void 0;
const BaseChannel_1 = require("../BaseChannel");
class PostParser {
    static loadPost(target, data) {
        var _a, _b, _c, _d;
        const { postId, authorText, authorThumbnail, authorEndpoint, contentText, publishedTimeText, voteCount, } = data;
        // Basic information
        target.id = postId;
        target.content = (_a = contentText === null || contentText === void 0 ? void 0 : contentText.runs) === null || _a === void 0 ? void 0 : _a.map((r) => r.text).join("");
        target.channel = new BaseChannel_1.BaseChannel({
            id: (_b = authorEndpoint === null || authorEndpoint === void 0 ? void 0 : authorEndpoint.browseEndpoint) === null || _b === void 0 ? void 0 : _b.browseId,
            name: (_c = authorText.runs) === null || _c === void 0 ? void 0 : _c[0].text,
            thumbnails: authorThumbnail.thumbnails,
            client: target.client,
        });
        target.timestamp = (_d = publishedTimeText.runs[0]) === null || _d === void 0 ? void 0 : _d.text;
        target.voteCount = voteCount.simpleText;
        return target;
    }
}
exports.PostParser = PostParser;
