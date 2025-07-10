import { YoutubeRawData } from "../../common";
import { VideoCompact } from "./VideoCompact";
export declare class VideoCompactParser {
    static loadVideoCompact(target: VideoCompact, data: YoutubeRawData): VideoCompact;
    static loadLockupVideoCompact(target: VideoCompact, data: YoutubeRawData): VideoCompact;
}
