/**
 * Represents a caption language option
 */
var CaptionLanguage = /** @class */ (function () {
    /** @hidden */
    function CaptionLanguage(attr) {
        Object.assign(this, attr);
    }
    /** Get the captions of this language using the url */
    CaptionLanguage.prototype.get = function (translationLanguageCode) {
        return this.captions.get(this.code, translationLanguageCode);
    };
    return CaptionLanguage;
}());
export { CaptionLanguage };
