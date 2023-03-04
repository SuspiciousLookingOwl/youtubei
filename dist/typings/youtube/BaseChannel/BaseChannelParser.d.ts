import { YoutubeRawData } from "../../common";
import { BaseChannel } from "./BaseChannel";
declare type TabType = keyof typeof BaseChannelParser.TAB_TYPE_PARAMS;
export declare class BaseChannelParser {
    static TAB_TYPE_PARAMS: {
        readonly videos: "EgZ2aWRlb3PyBgQKAjoA";
        readonly shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D";
        readonly live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D";
        readonly playlists: "EglwbGF5bGlzdHPyBgQKAkIA";
    };
    static loadBaseChannel(target: BaseChannel, data: YoutubeRawData): BaseChannel;
    /** Parse tab data from request, tab name is ignored if it's a continuation data */
    static parseTabData(name: TabType, data: YoutubeRawData): YoutubeRawData;
}
export {};
