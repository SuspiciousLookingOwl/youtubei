import { YoutubeRawData } from "../../common";
import { Client } from "../Client";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { BaseVideo } from "./BaseVideo";
export declare class BaseVideoParser {
    static loadBaseVideo(target: BaseVideo, data: YoutubeRawData): BaseVideo;
    static parseRelated(data: YoutubeRawData, client: Client): (VideoCompact | PlaylistCompact)[];
    static parseContinuation(data: YoutubeRawData): string | undefined;
    static parseRawData(data: YoutubeRawData): YoutubeRawData;
    private static parseCompactRenderer;
    private static parseRelatedFromSecondaryContent;
    private static parseButtonRenderer;
}
