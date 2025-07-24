import { YoutubeRawData, getContinuationFromItems } from "../../common";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { Post } from "../Post";
import { I_END_POINT } from "../constants";
import { BaseChannel } from "./BaseChannel";
import { BaseChannelParser } from "./BaseChannelParser";

type ConstructorParams = ContinuableConstructorParams & {
	channel?: BaseChannel;
};

/**
 * {@link Continuable} of posts inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.posts.next();
 * console.log(channel.posts.items) // first 30 posts
 *
 * let newPosts = await channel.posts.next();
 * console.log(newPosts) // 30 loaded posts
 * console.log(channel.posts.items) // first 60 posts
 *
 * await channel.posts.next(0); // load the rest of the posts in the channel
 * ```
 */
export class ChannelPosts extends Continuable<Post> {
	/** The channel this posts belongs to */
	channel?: BaseChannel;

	/** @hidden */
	constructor({ client, channel }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.channel = channel;
	}

	protected async fetch(): Promise<FetchResult<Post>> {
		const params = BaseChannelParser.TAB_TYPE_PARAMS.posts;

		const response = await this.client.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: this.channel?.id, params, continuation: this.continuation },
		});

		const items = BaseChannelParser.parseTabData("posts", response.data) as any[];
		const continuation = getContinuationFromItems(items);
		const data = items
			.map((i) => i.backstagePostThreadRenderer?.post?.backstagePostRenderer)
			.filter((i) => i !== undefined);

		return {
			continuation,
			items: data.map((i: YoutubeRawData) =>
				new Post({ client: this.client, channel: this.channel }).load(i)
			),
		};
	}
}
