"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicBaseAlbum = void 0;
const MusicBase_1 = require("../MusicBase");
class MusicBaseAlbum extends MusicBase_1.MusicBase {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
    }
}
exports.MusicBaseAlbum = MusicBaseAlbum;
