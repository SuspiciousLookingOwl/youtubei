---
id: quickstart
title: Quick Start
sidebar_label: Quick Start
slug: /
---

## Installation

```
npm i youtubei
```

## Example

```js
const { Client, MusicClient } = require("youtubei");
// or for TS / ES6
import { Client, MusicClient } from "youtubei";

const youtube = new Client();
const music = new MusicClient();

(async () => {
	const result = await youtube.search("Never gonna give you up", {
		type: "video", // video | playlist | channel | all
	});
	console.log(result.items);

	const musicResult = await youtube.search("Never gonna give you up");
	console.log(musicResult);
})();
```

## Read Client API

You can read the [`Client`](/docs/youtube/classes/client) or [`MusicClient`](/docs/music/classes/musicclient) API
