"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicVideoCompact = void 0;
const MusicBase_1 = require("../MusicBase");
class MusicVideoCompact extends MusicBase_1.MusicBase {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
    }
}
exports.MusicVideoCompact = MusicVideoCompact;
