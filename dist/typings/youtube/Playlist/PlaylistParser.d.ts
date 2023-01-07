import { YoutubeRawData } from "../../common";
import { Client } from "../Client";
import { VideoCompact } from "../VideoCompact";
import { Playlist } from "./Playlist";
export declare class PlaylistParser {
    static loadPlaylist(target: Playlist, data: YoutubeRawData): Playlist;
    static parseVideoContinuation(data: YoutubeRawData): string | undefined;
    static parseContinuationVideos(data: YoutubeRawData, client: Client): VideoCompact[];
    /**
     * Get compact videos
     *
     * @param playlistContents raw object from youtubei
     */
    private static parseVideos;
    private static parseSideBarInfo;
}
