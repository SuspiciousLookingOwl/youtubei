import { YoutubeRawData } from "./types";
export declare const getDuration: (s: string) => number;
export declare const stripToInt: (string: string) => number | null;
export declare const getContinuationFromItems: (items: YoutubeRawData, accessors?: string[]) => string | undefined;
export declare const mapFilter: (items: YoutubeRawData, key: string) => YoutubeRawData;
