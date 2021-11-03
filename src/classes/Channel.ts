import { YoutubeRawData } from "../common";
import ChannelCompact, { ChannelCompactAttributes } from "./ChannelCompact";
import PlaylistCompact from "./PlaylistCompact";
import Thumbnails from "./Thumbnails";
import VideoCompact from "./VideoCompact";

interface Shelf {
	title: string;
	subtitle?: string;
	items: ChannelCompact[] | VideoCompact[] | PlaylistCompact[];
}

/** @hidden */
interface ChannelAttributes extends ChannelCompactAttributes {
	banner: Thumbnails;
	tvBanner: Thumbnails;
	mobileBanner: Thumbnails;
	shelves: Shelf[];
}

/**  Represents a Youtube Channel */
export default class Channel extends ChannelCompact implements ChannelAttributes {
	banner!: Thumbnails;
	mobileBanner!: Thumbnails;
	tvBanner!: Thumbnails;
	shelves!: Shelf[];

	/** @hidden */
	constructor(channel: Partial<ChannelAttributes> = {}) {
		super();
		this.shelves = [];
		this.videos = [];
		this.playlists = [];
		Object.assign(this, channel);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Channel {
		const {
			channelId,
			title,
			avatar,
			subscriberCountText,
		} = data.header.c4TabbedHeaderRenderer;

		this.id = channelId;
		this.name = title;
		this.thumbnails = new Thumbnails().load(avatar.thumbnails);
		this.videoCount = 0; // data not available
		this.subscriberCount = subscriberCountText.simpleText;
		this.videos = [];
		this.playlists = [];

		const { tvBanner, mobileBanner, banner } = data.header.c4TabbedHeaderRenderer;

		this.banner = new Thumbnails().load(banner.thumbnails);
		this.tvBanner = new Thumbnails().load(tvBanner.thumbnails);
		this.mobileBanner = new Thumbnails().load(mobileBanner.thumbnails);

		// shelves
		const rawShelves =
			data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
				.sectionListRenderer.contents;

		for (const rawShelf of rawShelves) {
			const shelfRenderer = rawShelf.itemSectionRenderer.contents[0].shelfRenderer;
			if (!shelfRenderer) continue;

			const { title, content, subtitle } = shelfRenderer;
			if (!content.horizontalListRenderer) continue;

			const items:
				| ChannelCompact[]
				| VideoCompact[]
				| PlaylistCompact[] = content.horizontalListRenderer.items
				.map((i: YoutubeRawData) => {
					if (i.gridVideoRenderer)
						return new VideoCompact({ client: this.client }).load(i.gridVideoRenderer);
					if (i.gridPlaylistRenderer)
						return new PlaylistCompact({ client: this.client }).load(
							i.gridPlaylistRenderer
						);
					if (i.gridChannelRenderer)
						return new ChannelCompact({ client: this.client }).load(
							i.gridChannelRenderer
						);
					return undefined;
				})
				.filter((i: YoutubeRawData) => i !== undefined);

			const shelf: Shelf = {
				title: title.runs[0].text,
				subtitle: subtitle?.simpleText,
				items,
			};

			this.shelves.push(shelf);
		}

		return this;
	}
}
