"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicArtistCompact = void 0;
const MusicBaseArtist_1 = require("../MusicBaseArtist/MusicBaseArtist");
class MusicArtistCompact extends MusicBaseArtist_1.MusicBaseArtist {
    /** @hidden */
    constructor(attr) {
        super(attr);
        Object.assign(this, attr);
    }
}
exports.MusicArtistCompact = MusicArtistCompact;
