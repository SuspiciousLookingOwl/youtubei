import { YoutubeRawData } from "../../common";
import { Channel, Shelf } from "./Channel";
export declare class ChannelParser {
    static loadChannel(target: Channel, data: YoutubeRawData): Channel;
    static parseShelves(target: Channel, data: YoutubeRawData): Shelf[];
}
