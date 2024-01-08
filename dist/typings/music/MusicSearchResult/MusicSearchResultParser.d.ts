import { YoutubeRawData } from "../../common";
import { MusicClient } from "../MusicClient";
import { MusicSearchResultItem, MusicSearchType } from "./MusicSearchResult";
declare type ParseReturnType = {
    data: MusicSearchResultItem[];
    continuation: string | undefined;
};
export declare class MusicSearchResultParser {
    static parseInitialSearchResult(data: YoutubeRawData, type: MusicSearchType, client: MusicClient): ParseReturnType;
    static parseContinuationSearchResult(data: YoutubeRawData, type: MusicSearchType, client: MusicClient): ParseReturnType;
    private static parseSearchResult;
}
export {};
