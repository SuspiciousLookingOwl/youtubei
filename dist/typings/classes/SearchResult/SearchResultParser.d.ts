import { YoutubeRawData } from "../../common";
import { Client } from "../Client";
import { SearchResultItem } from "./SearchResult";
declare type ParseReturnType = {
    data: SearchResultItem[];
    continuation: string | undefined;
};
export declare class SearchResultParser {
    static parseInitialSearchResult(data: YoutubeRawData, client: Client): ParseReturnType;
    static parseContinuationSearchResult(data: YoutubeRawData, client: Client): ParseReturnType;
    private static parseSearchResult;
}
export {};
