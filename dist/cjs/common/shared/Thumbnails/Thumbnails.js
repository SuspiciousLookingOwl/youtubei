"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Thumbnails_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thumbnails = void 0;
const utils_1 = require("../../utils");
/**
 * Represents Thumbnails, usually found inside Playlist / Channel / Video, etc.
 *
 * {@link Thumbnails} is an array of {@link Thumbnail}
 *
 * @noInheritDoc
 */
let Thumbnails = Thumbnails_1 = class Thumbnails extends Array {
    /** @hidden */
    constructor() {
        super();
    }
    /**
     * Returns thumbnail with the lowest resolution, usually the first element of the Thumbnails array
     *
     * @example
     * ```js
     * const min = video.thumbnails.min;
     * ```
     */
    get min() {
        return Thumbnails_1.parseThumbnailUrl(this[0]);
    }
    /**
     * Returns thumbnail with the highest resolution, usually the last element of the Thumbnails array
     *
     * @example
     * ```js
     * const best = video.thumbnails.best;
     * ```
     */
    get best() {
        return Thumbnails_1.parseThumbnailUrl(this[this.length - 1]);
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(thumbnails) {
        this.push(...thumbnails);
        return this;
    }
    static parseThumbnailUrl({ url }) {
        if (url.startsWith("//"))
            return `https:${url}`;
        if (!url.startsWith("https://"))
            return `https://${url}`;
        else
            return url;
    }
};
Thumbnails = Thumbnails_1 = __decorate([
    utils_1.extendsBuiltIn()
], Thumbnails);
exports.Thumbnails = Thumbnails;
