# @globalfishingwatch/pbf

To use custom decoders for gfw api responses:

1. Import the decoder function

```js
import { vessels } from '@globalfishingwatch/pbf/decoders/vessels'
```

2. Use it in the response

```js
promise
  .then((r) => r.arrayBuffer())
  .then((buffer) => {
    const track = vessels.Track.decode(new Uint8Array(buffer))
    return track.data
  })
```
