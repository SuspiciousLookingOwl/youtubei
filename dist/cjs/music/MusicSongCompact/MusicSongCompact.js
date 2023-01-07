"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicSongCompact = void 0;
const MusicBase_1 = require("../MusicBase");
class MusicSongCompact extends MusicBase_1.MusicBase {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
    }
}
exports.MusicSongCompact = MusicSongCompact;
