# Youtubei

`Youtubei` is made to replace my other library [scrape-yt](https://github.com/SuspiciousLookingOwl/scrape-yt/). Instead of scrapping data from Youtube page, `youtubei` fetches data by sending a request directly to `https://www.youtube.com/youtubei/v1`, which should be faster and provide more reliable result.

<b>Requires Node >= 16</b>

#### [Documentation](https://suspiciouslookingowl.github.io/youtubei)

## Installation

```
npm i youtubei
```

or use the dev build directly from GitHub:

```
npm i git://github.com/suspiciouslookingowl/youtubei.git#dist
```

## Example

```js
const { Client, MusicClient } = require("youtubei");
// or for TS / ES6
import { Client, MusicClient } from "youtubei";

const youtube = new Client();
const music = new MusicClient();

const run = async () => {
	const videos = await youtube.search("Never gonna give you up", {
		type: "video", // video | playlist | channel | all
	});

	console.log(videos.items.length); // 20
	const nextVideos = await videos.next(); // load next page
	console.log(nextVideos.length); // 18-20, inconsistent next videos count from youtube
	console.log(videos.items.length); // 38 - 40

	// you can also pass the video URL
	const video = await youtube.getVideo("dQw4w9WgXcQ");

	const channelVideos = await video.channel.videos.next();
	const channelPlaylists = await video.channel.playlists.next();

	// you can also pass the playlist URL
	const playlist = await youtube.getPlaylist("UUHnyfMqiRRG1u-2MsSQLbXA");
	console.log(playlist.videos.items.length); // first 100 videos;
	let newVideos = await playlist.videos.next(); // load next 100 videos
	console.log(playlist.videos.items.length); // 200 videos;
	await playlist.videos.next(0); // load the rest videos in the playlist

	// search using music client
	const shelves = await music.search("Never gonna give you up");
	console.log(shelves);
};

run();
```
