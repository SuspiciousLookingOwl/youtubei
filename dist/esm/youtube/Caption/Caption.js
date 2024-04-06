/**
 * Represent a single video caption entry
 */
var Caption = /** @class */ (function () {
    /** @hidden */
    function Caption(attr) {
        Object.assign(this, attr);
    }
    Object.defineProperty(Caption.prototype, "end", {
        /** transcript end time in milliseconds */
        get: function () {
            return this.start + this.duration;
        },
        enumerable: false,
        configurable: true
    });
    return Caption;
}());
export { Caption };
