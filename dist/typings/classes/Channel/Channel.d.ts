import { YoutubeRawData } from "../../common";
import { BaseChannel, BaseChannelProperties } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { Thumbnails } from "../Thumbnails";
import { VideoCompact } from "../VideoCompact";
export interface Shelf {
    title: string;
    subtitle?: string;
    items: BaseChannel[] | VideoCompact[] | PlaylistCompact[];
}
/** @hidden */
interface ChannelProperties extends BaseChannelProperties {
    banner?: Thumbnails;
    tvBanner?: Thumbnails;
    mobileBanner?: Thumbnails;
    shelves?: Shelf[];
}
/**  Represents a Youtube Channel */
export declare class Channel extends BaseChannel implements ChannelProperties {
    banner: Thumbnails;
    mobileBanner: Thumbnails;
    tvBanner: Thumbnails;
    shelves: Shelf[];
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
