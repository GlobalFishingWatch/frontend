# @globalfishingwatch/dataviews-client

A TypeScript library for managing and resolving dataviews in the Global Fishing Watch application ecosystem.
This library provides utilities for handling dataview configurations, URL workspace state management, and resource fetching.

## Installation

```bash
yarn add @globalfishingwatch/dataviews-client
```

## Key Features

### 1. Dataview Resolution

The library provides utilities to resolve dataviews with their configurations and datasets:

```typescript
import { resolveDataviews } from '@globalfishingwatch/dataviews-client'
const resolvedDataviews = resolveDataviews(dataviewInstances, dataviews, datasets, vesselGroups)
```

### 2. Workspace State Management

The library includes utilities for managing workspace state:

```typescript
import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'
// Parse URL query string to workspace object
const workspace = parseWorkspace(queryString)
// Stringify workspace object to URL query string
const queryString = stringifyWorkspace(workspace)
```

### 3. Resource Management

Provides Redux slice and utilities for managing dataview resources:

```typescript
import { fetchResourceThunk, resourcesReducer } from '@globalfishingwatch/dataviews-client'
// Fetch a resource
dispatch(fetchResourceThunk({ resource }))

// Add resources reducer to your Redux store
const store = configureStore({
  reducer: {
    resources: resourcesReducer,
  },
})
```

### 4. Migration utilities

Provides utilities for migrating dataviews from old to new format:

```typescript
import { runDatasetMigrations } from '@globalfishingwatch/dataviews-client'

// Migrate legacy dataset ID to current version
const newDatasetId = runDatasetMigrations(legacyDatasetId)
```

### Other features

See the rest of the features in the [source code](https://github.com/GlobalFishingWatch/frontend/blob/master/libs/dataviews-client/src/index.ts).

## Build and publish

```bash
nx build dataviews-client
nx publish dataviews-client
```

## Dependencies

- `@globalfishingwatch/api-types`
- `@globalfishingwatch/api-client`
- `@globalfishingwatch/data-transforms`
- `@globalfishingwatch/datasets-client`
- `@reduxjs/toolkit`
- `lodash`
- `luxon`
- `qs`

## License

MIT
