import protobuf from "protobufjs";
import { SearchOptions } from "../SearchResult";
import { SearchProto as ProtoType } from "./SearchProto";
export declare const SearchProto: protobuf.Type;
export declare const optionsToProto: (options: SearchOptions) => ProtoType["SearchOptions"];
