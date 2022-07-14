---
id: snippets-faq
title: Snippets & FAQ
sidebar_label: Snippets & FAQ
slug: /snippets-faq
---

This page contains snippets and FAQ related to `Youtubei`, with the assumption that this is how you declare the client:

```js
const { Client } = require("youtubei");
// or for TS / ES6
import { Client } from "youtubei";

const youtube = new Client();
```

and all of the codes are running inside an async function.

---

### How to search for a video?

```js
const videos = await youtube.search("Keyword", {
	type: "video"
});

console.log(videos.items);
```

### How to get search result from next pagination?

```js
const videos = await youtube.search("Keyword", {
	type: "video"
});

console.log(videos.items); // search result from first page

let nextVideos = await videos.next();
console.log(nextVideos); // search result from second page

nextVideos = await videos.next();
console.log(nextVideos); // search result from third page

console.log(videos.items); // search result from first, second, and third page.
```

### How to get all videos in a playlist?

```js
const playlist = await youtube.getPlaylist(PLAYLIST_ID);

await playlist.videos.next(0);

console.log(playlist.videos.items);
```

### How to get video's comments?

```js
const video = await youtube.getVideo(VIDEO_ID);

let comments = await video.comments.next();
console.log(comments.items); // first 20 comments

comments = await video.comments.next();
console.log(comments.items); // next 20 comments

console.log(video.comments.items); // all 40 loaded comments

await video.comments.next(0); // load the rest of the comments
console.log(video.comments.items); // all comments on the video

```

### How to listen to chat event on live video?

```js
// get the video
const video = await youtube.getVideo(LIVE_VIDEO_ID);

// add event listener
video.on("chat", (chat) => {
	console.log(`${chat.author.name}:  ${chat.message}`);
});

video.playChat(5000); // start chat polling with 5000ms chat delay

video.stopChat(); // stop chat polling

```
