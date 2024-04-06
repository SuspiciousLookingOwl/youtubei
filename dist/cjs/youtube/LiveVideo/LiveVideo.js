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
exports.LiveVideo = void 0;
const events_1 = require("events");
const common_1 = require("../../common");
const BaseVideo_1 = require("../BaseVideo");
const Chat_1 = require("../Chat");
const constants_1 = require("../constants");
const LiveVideoParser_1 = require("./LiveVideoParser");
/** Represents a video that's currently live, usually returned from `client.getVideo()` */
class LiveVideo extends BaseVideo_1.BaseVideo {
    /** @hidden */
    constructor(attr) {
        super(attr);
        this.delay = 0;
        this.timeoutMs = 0;
        this.isChatPlaying = false;
        this.chatQueue = [];
        Object.assign(this, attr);
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        super.load(data);
        LiveVideoParser_1.LiveVideoParser.loadLiveVideo(this, data);
        return this;
    }
    /**
     * Start polling for get live chat request
     *
     * @param delay chat delay in millisecond
     */
    playChat(delay = 0) {
        if (this.isChatPlaying)
            return;
        this.delay = delay;
        this.isChatPlaying = true;
        this.pollChatContinuation();
    }
    /** Stop request polling for live chat */
    stopChat() {
        if (!this.chatRequestPoolingTimeout)
            return;
        this.isChatPlaying = false;
        clearTimeout(this.chatRequestPoolingTimeout);
    }
    /** Start request polling */
    pollChatContinuation() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.http.post(constants_1.LIVE_CHAT_END_POINT, {
                data: { continuation: this.chatContinuation },
            });
            if (!response.data.continuationContents)
                return;
            const chats = LiveVideoParser_1.LiveVideoParser.parseChats(response.data);
            for (const c of chats) {
                const chat = new Chat_1.Chat({ client: this.client }).load(c);
                if (this.chatQueue.find((c) => c.id === chat.id))
                    continue;
                this.chatQueue.push(chat);
                const timeout = chat.timestamp / 1000 - (new Date().getTime() - this.delay);
                setTimeout(() => this.emit("chat", chat), timeout);
            }
            const { timeout, continuation } = LiveVideoParser_1.LiveVideoParser.parseContinuation(response.data);
            this.timeoutMs = timeout;
            this.chatContinuation = continuation;
            this.chatRequestPoolingTimeout = setTimeout(() => this.pollChatContinuation(), this.timeoutMs);
        });
    }
}
exports.LiveVideo = LiveVideo;
common_1.applyMixins(LiveVideo, [events_1.EventEmitter]);
