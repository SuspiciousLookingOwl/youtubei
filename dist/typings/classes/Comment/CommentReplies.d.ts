import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { Reply } from "../Reply";
import { Comment } from "./Comment";
declare type ConstructorParams = ContinuableConstructorParams & {
    comment: Comment;
};
/**
 * {@link Continuable} of replies inside a {@link Comment}
 */
export declare class CommentReplies extends Continuable<Reply> {
    /** The comment this replies belongs to */
    comment: Comment;
    /** @hidden */
    constructor({ client, comment }: ConstructorParams);
    protected fetch(): Promise<FetchResult<Reply>>;
}
export {};
