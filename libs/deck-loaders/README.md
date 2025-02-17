# deck-loaders

A utility library for loading and managing custom sources in our deck.gl layers.

## Loader types

### Fourwings Loader

It handles the 4wings tile format, specifically designed for geo temporal data:

- Custom pbf reader to parse the data in the [response format](https://docs.google.com/presentation/d/1OJCg2zJp0zEVcYJ6Z4ePywy0oO59FnZ2aPUXp7LB4sc/edit#slide=id.g1125c16eeb4_2_7)
- Based in customizable [intervals](https://docs.google.com/presentation/d/1OJCg2zJp0zEVcYJ6Z4ePywy0oO59FnZ2aPUXp7LB4sc/edit#slide=id.g1128f3393b5_3_0) ('YEAR' | 'MONTH' | 'DAY' | 'HOUR') to generate a cell with:
  - The geometry based on its position to ensure equal area sizes within the tile
  - The properties with is values and dates
- With other params supported like:
  - Aggregation operations ('SUM' | 'AVG')
  - No-data value handling
  - Time range buffering

### Vessel Loaders

- **VesselTrackLoader**:
  - Handles vessel track and generates binary data with its attributes for the VesselTrackLayer
- **VesselEventsLoader**:
  - Processes vessel-related events and activities in desired format

### User track layers

Parse custom data for user track layers to filter out points and properties

## Installation

```bash
yarn add @globalfishingwatch/deck-loaders
```

## Usage example

```ts
import { VesselTrackLoader } from '@globalfishingwatch/deck-loaders'
import { VesselTrackLayer } from '@globalfishingwatch/deck-layers'

const vesselTrackLoader = new VesselTrackLayer({
  data: 'https://gateway.api.globalfishingwatch.org/v3/vessels/[vesselId]/tracks',
  loaders: [VesselTrackLoader],
})
```

## Build and publish

```bash
nx build deck-loaders
nx publish deck-loaders
```

## Documentation

For more detailed documentation, see:

- [deck.gl Loading Data Guide](https://deck.gl/docs/developer-guide/loading-data)
- [loaders.gl Documentation](https://loaders.gl)
