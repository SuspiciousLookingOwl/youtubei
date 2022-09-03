import { YoutubeRawData } from "../../common";
import { Comment } from "../Comment";
import { Video } from "./Video";
export declare class VideoParser {
    static loadVideo(target: Video, data: YoutubeRawData): Video;
    static parseComments(data: YoutubeRawData, video: Video): Comment[];
    static parseCommentContinuation(data: YoutubeRawData): string | undefined;
}
