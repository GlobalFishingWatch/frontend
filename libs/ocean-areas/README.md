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

## Update data using scripts

### Prerequisites

- Install google-cloud-sdk

```bash
brew install google-cloud-sdk
```

Or download from https://cloud.google.com/sdk/docs/install

- Authenticate

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

- Setup authentication

```bash
gcloud auth application-default login
```

- Set environment variables

.env file

```env
GOOGLE_BUCKET_ID=bucket-id
GOOGLE_CLOUD_PROJECT_ID=project-id
```

## License

MIT
