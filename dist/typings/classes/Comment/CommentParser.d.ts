import { YoutubeRawData } from "../../common";
import { Reply } from "../Reply";
import { Comment } from "./Comment";
export declare class CommentParser {
    static loadComment(target: Comment, data: YoutubeRawData): Comment;
    static parseContinuation(data: YoutubeRawData): string | undefined;
    static parseReplies(data: YoutubeRawData, comment: Comment): Reply[];
}
