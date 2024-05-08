import { Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { Channel, ChannelShelf } from "./Channel";

export class ChannelParser {
	static loadChannel(target: Channel, data: YoutubeRawData): Channel {
		let channelId, title, avatar, subscriberCountText, tvBanner, mobileBanner, banner;
		const { c4TabbedHeaderRenderer, pageHeaderRenderer } = data.header;

		if (c4TabbedHeaderRenderer) {
			channelId = c4TabbedHeaderRenderer.channelId;
			title = c4TabbedHeaderRenderer.title;
			subscriberCountText = c4TabbedHeaderRenderer.subscriberCountText?.simpleText;
			avatar = c4TabbedHeaderRenderer.avatar?.thumbnails;
			tvBanner = c4TabbedHeaderRenderer.tvBanner?.thumbnails;
			mobileBanner = c4TabbedHeaderRenderer.mobileBanner.thumbnails;
			banner = c4TabbedHeaderRenderer.banner.thumbnails;
		} else {
			channelId =
				data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.endpoint
					.browseEndpoint.browseId;
			title = pageHeaderRenderer.pageTitle;

			const {
				metadata,
				image: imageModel,
				banner: bannerModel,
			} = pageHeaderRenderer.content.pageHeaderViewModel;

			subscriberCountText =
				metadata.contentMetadataViewModel.metadataRows[1].metadataParts[0].text.content;
			avatar = imageModel.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources;
			banner = bannerModel.imageBannerViewModel.image.sources;
		}

		target.id = channelId;
		target.name = title;
		target.thumbnails = new Thumbnails().load(avatar);
		target.videoCount = 0; // data not available
		target.subscriberCount = subscriberCountText;

		target.banner = new Thumbnails().load(banner || []);
		target.tvBanner = new Thumbnails().load(tvBanner || []);
		target.mobileBanner = new Thumbnails().load(mobileBanner || []);
		target.shelves = ChannelParser.parseShelves(target, data);

		return target;
	}

	static parseShelves(target: Channel, data: YoutubeRawData): ChannelShelf[] {
		const shelves: ChannelShelf[] = [];

		const rawShelves =
			data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
				.sectionListRenderer.contents;

		for (const rawShelf of rawShelves) {
			const shelfRenderer = rawShelf.itemSectionRenderer.contents[0].shelfRenderer;
			if (!shelfRenderer) continue;

			const { title, content, subtitle } = shelfRenderer;
			if (!content.horizontalListRenderer) continue;

			const items:
				| BaseChannel[]
				| VideoCompact[]
				| PlaylistCompact[] = content.horizontalListRenderer.items
				.map((i: YoutubeRawData) => {
					if (i.gridVideoRenderer)
						return new VideoCompact({ client: target.client }).load(
							i.gridVideoRenderer
						);
					if (i.gridPlaylistRenderer)
						return new PlaylistCompact({ client: target.client }).load(
							i.gridPlaylistRenderer
						);
					if (i.gridChannelRenderer)
						return new BaseChannel({ client: target.client }).load(
							i.gridChannelRenderer
						);
					return undefined;
				})
				.filter((i: YoutubeRawData) => i !== undefined);

			const shelf: ChannelShelf = {
				title: title.runs[0].text,
				subtitle: subtitle?.simpleText,
				items,
			};

			shelves.push(shelf);
		}

		return shelves;
	}
}
