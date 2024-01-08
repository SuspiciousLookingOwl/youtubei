import protobuf from "protobufjs";
import { MusicSearchType } from "../MusicSearchResult";
import { MusicSearchProto as ProtoType } from "./MusicSearchProto";
export declare const MusicSearchProto: protobuf.Type;
export declare const optionsToProto: (type: MusicSearchType) => ProtoType["MusicSearchOptions"];
