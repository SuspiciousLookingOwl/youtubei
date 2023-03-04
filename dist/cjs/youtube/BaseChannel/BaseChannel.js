"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChannel = void 0;
const Base_1 = require("../Base");
const BaseChannelParser_1 = require("./BaseChannelParser");
const ChannelLive_1 = require("./ChannelLive");
const ChannelPlaylists_1 = require("./ChannelPlaylists");
const ChannelShorts_1 = require("./ChannelShorts");
const ChannelVideos_1 = require("./ChannelVideos");
/**  Represents a Youtube Channel */
class BaseChannel extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
        this.videos = new ChannelVideos_1.ChannelVideos({ channel: this, client: this.client });
        this.shorts = new ChannelShorts_1.ChannelShorts({ channel: this, client: this.client });
        this.live = new ChannelLive_1.ChannelLive({ channel: this, client: this.client });
        this.playlists = new ChannelPlaylists_1.ChannelPlaylists({ channel: this, client: this.client });
    }
    /** The URL of the channel page */
    get url() {
        return `https://www.youtube.com/channel/${this.id}`;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        BaseChannelParser_1.BaseChannelParser.loadBaseChannel(this, data);
        return this;
    }
}
exports.BaseChannel = BaseChannel;
