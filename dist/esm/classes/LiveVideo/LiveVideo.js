var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { EventEmitter } from "events";
import { applyMixins } from "../../common";
import { BaseVideo } from "../BaseVideo";
import { Chat } from "../Chat";
import { LIVE_CHAT_END_POINT } from "../constants";
import { LiveVideoParser } from "./LiveVideoParser";
/** Represents a video that's currently live, usually returned from `client.getVideo()` */
var LiveVideo = /** @class */ (function (_super) {
    __extends(LiveVideo, _super);
    /** @hidden */
    function LiveVideo(attr) {
        var _this = _super.call(this, attr) || this;
        _this._delay = 0;
        _this._timeoutMs = 0;
        _this._isChatPlaying = false;
        _this._chatQueue = [];
        Object.assign(_this, attr);
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    LiveVideo.prototype.load = function (data) {
        _super.prototype.load.call(this, data);
        LiveVideoParser.loadLiveVideo(this, data);
        return this;
    };
    /**
     * Start polling for get live chat request
     *
     * @param delay chat delay in millisecond
     */
    LiveVideo.prototype.playChat = function (delay) {
        if (delay === void 0) { delay = 0; }
        if (this._isChatPlaying)
            return;
        this._delay = delay;
        this._isChatPlaying = true;
        this.pollChatContinuation();
    };
    /** Stop request polling for live chat */
    LiveVideo.prototype.stopChat = function () {
        if (!this._chatRequestPoolingTimeout)
            return;
        this._isChatPlaying = false;
        clearTimeout(this._chatRequestPoolingTimeout);
    };
    /** Start request polling */
    LiveVideo.prototype.pollChatContinuation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, chats, _loop_1, this_1, chats_1, chats_1_1, c, _a, timeout, continuation;
            var e_1, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.client.http.post(LIVE_CHAT_END_POINT, {
                            data: { continuation: this.chatContinuation },
                        })];
                    case 1:
                        response = _c.sent();
                        if (!response.data.continuationContents)
                            return [2 /*return*/];
                        chats = LiveVideoParser.parseChats(response.data);
                        _loop_1 = function (c) {
                            var chat = new Chat({ client: this_1.client }).load(c);
                            if (this_1._chatQueue.find(function (c) { return c.id === chat.id; }))
                                return "continue";
                            this_1._chatQueue.push(chat);
                            var timeout_1 = chat.timestamp / 1000 - (new Date().getTime() - this_1._delay);
                            setTimeout(function () { return _this.emit("chat", chat); }, timeout_1);
                        };
                        this_1 = this;
                        try {
                            for (chats_1 = __values(chats), chats_1_1 = chats_1.next(); !chats_1_1.done; chats_1_1 = chats_1.next()) {
                                c = chats_1_1.value;
                                _loop_1(c);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (chats_1_1 && !chats_1_1.done && (_b = chats_1.return)) _b.call(chats_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        _a = LiveVideoParser.parseContinuation(response.data), timeout = _a.timeout, continuation = _a.continuation;
                        this._timeoutMs = timeout;
                        this.chatContinuation = continuation;
                        this._chatRequestPoolingTimeout = setTimeout(function () { return _this.pollChatContinuation(); }, this._timeoutMs);
                        return [2 /*return*/];
                }
            });
        });
    };
    return LiveVideo;
}(BaseVideo));
applyMixins(LiveVideo, [EventEmitter]);
export { LiveVideo };
