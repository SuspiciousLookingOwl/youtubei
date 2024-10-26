import { Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Reply } from "./Reply";

export class ReplyParser {
	static loadReply(target: Reply, data: YoutubeRawData): Reply {
		const { properties, toolbar, author, avatar } = data;

		// Basic information
		target.id = properties.commentId;
		target.content = properties.content.content;
		target.publishDate = properties.publishedTime;
		target.likeCount = +toolbar.likeCountLiked; // probably broken
		target.isAuthorChannelOwner = !!author.isCreator;

		// Author
		target.author = new BaseChannel({
			id: author.id,
			name: author.displayName,
			thumbnails: new Thumbnails().load(avatar.image.sources),
			client: target.client,
		});

		return target;
	}
}
