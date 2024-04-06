"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caption = void 0;
/**
 * Represent a single video caption entry
 */
class Caption {
    /** @hidden */
    constructor(attr) {
        Object.assign(this, attr);
    }
    /** transcript end time in milliseconds */
    get end() {
        return this.start + this.duration;
    }
}
exports.Caption = Caption;
