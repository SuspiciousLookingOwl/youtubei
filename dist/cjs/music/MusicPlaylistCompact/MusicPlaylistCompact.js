"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylistCompact = void 0;
const MusicBase_1 = require("../MusicBase");
class MusicPlaylistCompact extends MusicBase_1.MusicBase {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
    }
}
exports.MusicPlaylistCompact = MusicPlaylistCompact;
