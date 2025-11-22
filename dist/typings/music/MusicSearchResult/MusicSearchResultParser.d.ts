import { YoutubeRawData } from "../../common";
import { MusicClient } from "../MusicClient";
import { MusicSongCompact } from "../MusicSongCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
import { MusicSearchResultItem } from "./MusicSearchResult";
declare type ParseReturnType = {
    data: MusicSearchResultItem[];
    continuation: string | undefined;
};
export declare class MusicSearchResultParser {
    static parseInitialSearchResult(data: YoutubeRawData, client: MusicClient): ParseReturnType;
    static parseContinuationSearchResult(data: YoutubeRawData, client: MusicClient): ParseReturnType;
    private static parseTopResult;
    private static parseSearchResult;
    private static parseSearchItem;
    static parseVideoItem(item: YoutubeRawData, pageType: string, client: MusicClient): MusicSongCompact | MusicVideoCompact | undefined;
    private static parsePlaylistItem;
    private static parseAlbumItem;
    private static parseArtistItem;
    private static parseAlbum;
    private static parseArtists;
    private static parseChannel;
    private static parseArtistsOrChannel;
}
export {};
