import { YoutubeRawData } from "../../common";
import { LiveVideo } from "./LiveVideo";
export declare class LiveVideoParser {
    static loadLiveVideo(target: LiveVideo, data: YoutubeRawData): LiveVideo;
    static parseChats(data: YoutubeRawData): YoutubeRawData[];
    static parseContinuation(data: YoutubeRawData): {
        continuation: string;
        timeout: number;
    };
}
