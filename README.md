# Youtubei (WIP)

`Youtubei` is built to replace my other library [scrape-yt](https://github.com/SuspiciousLookingOwl/scrape-yt/). Instead of scrapping data from Youtube page, `youtubei` fetches data by sending a request directly to `https://www.youtube.com/youtubei/v1`, which should be faster and provide more reliable result.

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
		limit: 10,
	});

	// you can also pass the video URL
	const video = await youtube.getVideo("dQw4w9WgXcQ"); 

	const channelVideos = await video.channel.getVideos();
	const channelPlaylists = await video.channel.getPlaylists();

	// you can also pass the playlist URL
	const playlist = await youtube.getPlaylist("UUsBjURrPoezykLs9EqgamOA", { 
		// Get first 100 videos of the playlist. Set to 2 for 200, 3 for 300, and so on. Default is 0 (get all videos on the playlist). Keep in mind that Youtube can only get 100 playlist videos at a time, so if you are fetching all videos from a playlist with 1000 videos, this package will send 10 different requests one at a time, which will make the proses 10x longer. For the fastest response, set it to 1
		continuationLimit: 1, 
	}); 

};

run();
```

## Documentation

Coming soon.