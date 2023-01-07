import { YoutubeRawData } from "../../common";
import { MixPlaylist } from "./MixPlaylist";
export declare class MixPlaylistParser {
    static loadMixPlaylist(target: MixPlaylist, data: YoutubeRawData): MixPlaylist;
    private static parseVideos;
}
