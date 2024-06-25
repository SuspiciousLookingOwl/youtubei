import { Shelf, YoutubeRawData } from "../../common";
import { MusicAlbumCompact } from "../MusicAlbumCompact";
import { MusicClient, MusicTopShelf } from "../MusicClient";
import { MusicPlaylistCompact } from "../MusicPlaylistCompact";
import { MusicSongCompact } from "../MusicSongCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
export declare class MusicAllSearchResultParser {
    static parseTopResult(data: YoutubeRawData, client: MusicClient): MusicTopShelf | undefined;
    static parseSearchResult(data: YoutubeRawData, client: MusicClient): Shelf<MusicVideoCompact[] | MusicAlbumCompact[] | MusicPlaylistCompact[]>[];
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
