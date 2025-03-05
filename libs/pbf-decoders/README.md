# @globalfishingwatch/pbf-decoders

Protocol Buffer decoders library for Global Fishing Watch data formats.

## Overview

This library provides Protocol Buffer decoders for working with GFW's binary data formats, specifically for:

- Vessel tracking data (4wings tile format)
- Vessel information and queries

## Installation

```bash
yarn add @globalfishingwatch/pbf-decoders
```

## Usage

### Import

```typescript
return import('@globalfishingwatch/pbf-decoders').then(({ vessels }) => {
  return res.arrayBuffer().then((buffer) => {
    const track = vessels.Track.decode(new Uint8Array(buffer))
    return track.data
  })
})
```

### Proto Files

The Protocol Buffer definitions are located in:

- `proto/4wings-tile.proto`
- `proto/vessels.proto`

### Scripts

- `yarn decoders`: Generates all decoder files from proto definitions
- `yarn build`: Builds the library for distribution
- `yarn publish`: Publishes the package

## License

MIT
