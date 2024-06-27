"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCaptions = void 0;
const Base_1 = require("../Base");
const Caption_1 = require("../Caption");
/**
 * Captions of a video
 *
 * @example
 * ```js
 *
 * console.log(video.captions.languages.map((l) => `${l.code} - ${l.name}`)); // printing out available languages for captions
 *
 * console.log(await video.captions.get("en")); // printing out captions of a specific language using language code
 * ```
 */
class VideoCaptions extends Base_1.Base {
    /** @hidden */
    constructor({ video, client }) {
        super(client);
        this.video = video;
        this.languages = [];
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        const { captionTracks } = data;
        if (captionTracks) {
            this.languages = captionTracks.map((track) => new Caption_1.CaptionLanguage({
                captions: this,
                name: track.name.simpleText,
                code: track.languageCode,
                isTranslatable: !!track.isTranslatable,
                url: track.baseUrl,
            }));
        }
        return this;
    }
    /**
     * Get captions of a specific language or a translation of a specific language
     */
    get(languageCode, translationLanguageCode) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!languageCode)
                languageCode = this.client.options.youtubeClientOptions.hl;
            const url = (_a = this.languages.find((l) => l.code.toUpperCase() === (languageCode === null || languageCode === void 0 ? void 0 : languageCode.toUpperCase()))) === null || _a === void 0 ? void 0 : _a.url;
            if (!url)
                return undefined;
            const params = { fmt: "json3" };
            if (translationLanguageCode)
                params["tlang"] = translationLanguageCode;
            const response = yield this.client.http.get(url, { params });
            const captions = (_b = response.data.events) === null || _b === void 0 ? void 0 : _b.reduce((curr, e) => {
                var _a;
                if (e.segs === undefined)
                    return curr;
                curr.push(new Caption_1.Caption({
                    duration: e.dDurationMs,
                    start: e.tStartMs,
                    text: (_a = e.segs) === null || _a === void 0 ? void 0 : _a.map((s) => s.utf8).join(),
                    segments: e.segs,
                }));
                return curr;
            }, []);
            return captions;
        });
    }
}
exports.VideoCaptions = VideoCaptions;
