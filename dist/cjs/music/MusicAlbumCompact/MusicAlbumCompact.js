"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicAlbumCompact = void 0;
const MusicBaseAlbum_1 = require("../MusicBaseAlbum");
class MusicAlbumCompact extends MusicBaseAlbum_1.MusicBaseAlbum {
    /** @hidden */
    constructor(attr) {
        super(attr);
        Object.assign(this, attr);
    }
}
exports.MusicAlbumCompact = MusicAlbumCompact;
