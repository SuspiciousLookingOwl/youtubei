"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptionLanguage = void 0;
/**
 * Represents a caption language option
 */
class CaptionLanguage {
    /** @hidden */
    constructor(attr) {
        Object.assign(this, attr);
    }
    /** Get the captions of this language using the url */
    get(translationLanguageCode) {
        return this.captions.get(this.code, translationLanguageCode);
    }
}
exports.CaptionLanguage = CaptionLanguage;
