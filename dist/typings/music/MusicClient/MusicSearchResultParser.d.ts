import { Shelf, YoutubeRawData } from "../../common";
import { MusicAlbumCompact } from "../MusicAlbumCompact";
import { MusicPlaylistCompact } from "../MusicPlaylistCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
import { MusicClient } from "./MusicClient";
export declare class MusicSearchResultParser {
    static parseSearchResult(data: YoutubeRawData, client: MusicClient): Shelf<MusicVideoCompact[] | MusicAlbumCompact[] | MusicPlaylistCompact[]>[];
    private static parseSearchItem;
    private static parseVideoItem;
    private static parsePlaylistItem;
    private static parseAlbumItem;
    private static parseArtistItem;
    private static parseArtists;
    private static parseChannel;
    private static parseArtistOrChannel;
}
