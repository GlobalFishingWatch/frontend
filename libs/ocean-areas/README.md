# Ocean Areas Library

A TypeScript library for handling and querying ocean areas, including Exclusive Economic Zones (EEZs), Marine Protected Areas (MPAs), and general ocean regions.
This library provides functionality for searching, localizing, and determining geographical relationships between points and ocean areas.

## Installation

```bash
yarn add @globalfishingwatch/ocean-areas
```

## Features

- Search ocean areas by name
- Get ocean areas by geographical coordinates
- Localization support (English, Spanish, French)
- Distance-based area queries
- Overlapping area detection
- Bounding box calculations

## Usage

### Import

```typescript
import { getOceanAreas } from '@globalfishingwatch/ocean-areas'
const areas = await getOceanAreas(
  {
    latitude: -3,
    longitude: 25,
  },
  {
    locale: 'en', // Optional: Filter by area types
    types: ['eez', 'mpa'], // Optional: Filter by area types
  }
)
```

## Build and publish

```bash
nx build ocean-areas
nx publish ocean-areas
```

## Dependencies

- `@turf/*`: For geographical calculations
- `match-sorter`: For fuzzy searching
- GeoJSON types and utilities

## License

MIT
