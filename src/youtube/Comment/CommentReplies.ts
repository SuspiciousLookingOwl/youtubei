import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { Reply } from "../Reply";
import { I_END_POINT } from "../constants";
import { Comment } from "./Comment";
import { CommentParser } from "./CommentParser";

type ConstructorParams = ContinuableConstructorParams & {
	comment: Comment;
};

/**
 * {@link Continuable} of replies inside a {@link Comment}
 */
export class CommentReplies extends Continuable<Reply> {
	/** The comment this replies belongs to */
	comment: Comment;

	/** @hidden */
	constructor({ client, comment }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.comment = comment;
	}

	protected async fetch(): Promise<FetchResult<Reply>> {
		const response = await this.client.http.post(`${I_END_POINT}/next`, {
			data: { continuation: this.continuation },
		});

		const continuation = CommentParser.parseContinuation(response.data);
		const items = CommentParser.parseReplies(response.data, this.comment);

		return { continuation, items };
	}
}
