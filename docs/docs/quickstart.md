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
const { Client } = require("youtubei");
// or for TS / ES6
import { Client } from "youtubei";

const youtube = new Client();

(async () => {
	const result = await youtube.search("Never gonna give you up", {
		type: "video", // video | playlist | channel | all
	});

	console.log(result.items);
})();
```

## Read Client API

You can read the `Client` API here: [`api/classes/Client`](/docs/api/classes/client)
