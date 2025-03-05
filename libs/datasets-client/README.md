# @globalfishingwatch/datasets-client

A TypeScript library for handling Global Fishing Watch datasets configuration and utilities.

## Installation

```bash
yarn add @globalfishingwatch/datasets-client
```

## Usage example

Calculates temporal extent of datasets

```ts
import { getDatasetsExtent } from '@globalfishingwatch/datasets-client'

const extent = getDatasetsExtent([dataset1, dataset2])
```

Resolves API endpoint URL with parameters

```ts
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'

const endpoint = resolveEndpoint(dataset, datasetConfig, options)
```

## Build and publish

```bash
nx build datasets-client
nx publish datasets-client
```

## Dependencies

- @globalfishingwatch/api-types
- d3-scale

## License

MIT
