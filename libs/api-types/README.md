# @globalfishingwatch/api-types

TypeScript type definitions for Global Fishing Watch API responses and data structures.

## Usage

Import types as needed:

```ts
import { Dataset, Dataview, ApiEvent, Vessel } from '@globalfishingwatch/api-types'
```

## Main Exports

### Datasets

- `Dataset`, `ApiDataset`, `DownloadDataset` - Dataset types and variants
- `DatasetTypes`, `DatasetStatus`, `DatasetCategory`, `DatasetSubCategory` - Enums
- `DatasetFilters`, `DatasetConfiguration` - Filter and configuration types

### Dataviews

- `Dataview`, `DataviewInstance`, `DataviewCreation` - Dataview types
- `DataviewType`, `DataviewCategory` - Enums
- `DataviewConfig`, `DataviewDatasetConfig` - Configuration types

### Events

- `ApiEvent`, `ApiEvents` - Event types with pagination
- `EventTypes` - Enum (encounter, fishing, gaps, port_visit, loitering)
- `EncounterEvent`, `FishingEvent`, `GapEvent`, `PortEvent`, `LoiteringEvent` - Specific event types

### Vessels

- `Vessel`, `VesselSearch` - Vessel data types
- `VesselTypeV2` - Vessel type union
- `Authorization` - Vessel authorization data

### Users & Permissions

- `UserData`, `UserGroup` - User and group types
- `UserPermission`, `UserPermissionType`, `UserPermissionValue` - Permission types

### Endpoints

- `Endpoint`, `EndpointId` - API endpoint definitions
- `EndpointParam` - Endpoint parameter types

### Other

- `Pagination` - Pagination response types
- `Workspace`, `VesselGroup` - Workspace and vessel group types
- `Stats`, `Thumbnail`, `Tracks` - Utility types
- `Geometries`, `Thinning` - Geometry and thinning types

**Enum Constants:**

- `DATASET_TYPES` - Array of all dataset types
- `DATASET_STATUS` - Array of all dataset statuses
- `DATASET_CATEGORIES` - Array of all dataset categories
- `DATASET_SUB_CATEGORIES` - Array of all dataset subcategories
- `DATASET_CONFIGURATION_FILTERS` - Array of filter keys (fourwings, events, tracks, vessels)
- `DATASET_CONFIGURATION_FILTER_TYPES` - Array of filter types (boolean, coordinate, number, range, sql, string, timestamp)
- `DATASET_CONFIGURATION_FILTER_FORMATS` - Array of filter formats (date-time, latitude, longitude)
- `DATASET_CONFIGURATION_FILTER_OPERATIONS` - Array of filter operations (gt, lt, gte, lte)
- `DATASET_CONFIGURATION_CONTEXT_FORMATS` - Array of context formats (GEOJSON, PMTILE, CSV)
- `DATASET_CONFIGURATION_FUNCTIONS` - Array of aggregation functions (AVG, SUM)
- `DATASET_CONFIGURATION_INTERVALS` - Array of intervals (YEAR, MONTH, DAY, HOUR)
- `DATASET_CONFIGURATION_BULK_DOWNLOAD_FORMATS` - Array of download formats (CSV, JSON)
