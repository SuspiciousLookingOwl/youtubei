import { YoutubeRawData } from "../../common";
import { BaseChannel } from "./BaseChannel";
export declare class BaseChannelParser {
    static TAB_TYPE_PARAMS: {
        readonly videos: "EgZ2aWRlb3M%3D";
        readonly playlists: "EglwbGF5bGlzdHM%3D";
    };
    static loadBaseChannel(target: BaseChannel, data: YoutubeRawData): BaseChannel;
    /** Parse tab data from request, tab name is ignored if it's a continuation data */
    static parseTabData(name: "videos" | "playlists", data: YoutubeRawData): YoutubeRawData;
}
