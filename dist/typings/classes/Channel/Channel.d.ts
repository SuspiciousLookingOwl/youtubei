import { Shelf, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel, BaseChannelProperties } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
export declare type ChannelShelf = Shelf<BaseChannel[] | VideoCompact[] | PlaylistCompact[]> & {
    subtitle?: string;
};
/** @hidden */
interface ChannelProperties extends BaseChannelProperties {
    banner?: Thumbnails;
    tvBanner?: Thumbnails;
    mobileBanner?: Thumbnails;
    shelves?: ChannelShelf[];
}
/**  Represents a Youtube Channel */
export declare class Channel extends BaseChannel implements ChannelProperties {
    banner: Thumbnails;
    mobileBanner: Thumbnails;
    tvBanner: Thumbnails;
    shelves: ChannelShelf[];
    /** @hidden */
    constructor(attr: ChannelProperties);
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): Channel;
}
export {};
