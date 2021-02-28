# Youtubei (WIP)

`Youtubei` is made to replace my other library [scrape-yt](https://github.com/SuspiciousLookingOwl/scrape-yt/). Instead of scrapping data from Youtube page, `youtubei` fetches data by sending a request directly to `https://www.youtube.com/youtubei/v1`, which should be faster and provide more reliable result.

<b>Requires Node >= 12</b>

#### [Documentation](https://youtubei.netlify.app/docs)

## Installation
```
npm i youtubei
```


## Example
```js
const { Client } = require("youtubei");
// or for TS / ES6
import { Client } from "youtubei";

const youtube = new Client();

const run = async () => {
	const videos = await youtube.search("Never gonna give you up", {
		type: "video", // video | playlist | channel | all
	});

	console.log(videos.length); // 20
	const nextVideos = await videos.next(); // load next page
	console.log(nextVideos.length); // 18-20, inconsistent next videos count from youtube
	console.log(videos.length); // 38 - 40

	// you can also pass the video URL
	const video = await youtube.getVideo("dQw4w9WgXcQ");

	const channelVideos = await video.channel.getVideos();
	const channelPlaylists = await video.channel.getPlaylists();

	// you can also pass the playlist URL
	const playlist = await youtube.getPlaylist("UUHnyfMqiRRG1u-2MsSQLbXA");
	console.log(playlist.videos.length); // first 100 videos;
	let newVideos = await playlist.next(); // load next 100 videos
	console.log(playlist.videos.length); // 200 videos;
	await playlist.next(0); // load the rest videos in the playlist

};

run();
```