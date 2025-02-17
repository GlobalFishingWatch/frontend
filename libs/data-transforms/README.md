# @globalfishingwatch/data-transforms

A utility library for transforming various data formats and types commonly used in GFW applications.

## Features

### Coordinate Transformations

- Parse and validate geographic coordinates
- Handle coordinate wrapping around the antimeridian
- Buffer operations on geographic features
- Dissolve operations on geometries

### Date Handling

- UTC date conversions and formatting
- Support for various date formats (ISO, SQL, RFC2822)
- Interval-based date formatting

### File Format Conversions

- KML/KMZ to GeoJSON conversion
- Shapefile to GeoJSON conversion
- ZIP file handling

### Geographic Features

- Feature filtering by bounds
- Track coordinate filtering
- Segment handling and transformations
- Buffer and dissolve operations on geometries

### Other features

See the rest of the features in the [source code](https://github.com/GlobalFishingWatch/frontend/blob/master/libs/data-transforms/src/index.ts).

## Installation

```bash
yarn add @globalfishingwatch/data-transforms
```

## Usage example

```ts
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
const filteredFeatures = filterFeaturesByBounds({
  features,
  bounds: {
    north: 50,
    south: 30,
    east: 10,
    west: -10,
  },
})
```

## Build and publish

```bash
nx build data-transforms
nx publish data-transforms
```

## Dependencies

- @turf/turf - For geographic calculations
- luxon - For date handling
- jszip - For ZIP file processing
- @tmcw/togeojson - For KML conversion
- shpjs - For Shapefile processing

## License

MIT
