"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRelated = void 0;
const Continuable_1 = require("../Continuable");
const constants_1 = require("../constants");
const BaseVideoParser_1 = require("./BaseVideoParser");
/**
 * {@link Continuable} of related videos inside a Video
 */
class VideoRelated extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ video, client }) {
        super({ client });
        this.video = video;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/next`, {
                data: { continuation: this.continuation },
            });
            const items = BaseVideoParser_1.BaseVideoParser.parseRelated(response.data, this.client);
            const continuation = BaseVideoParser_1.BaseVideoParser.parseContinuation(response.data);
            return {
                continuation,
                items,
            };
        });
    }
}
exports.VideoRelated = VideoRelated;
