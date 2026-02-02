import type { ApiDataset } from './datasets'
import {
  DatasetCategory,
  DatasetDocumentationStatusTypes,
  DatasetStatus,
  DatasetSubCategory,
  DatasetTypes,
} from './datasets'
import type {
  AggregationFunction,
  BulkDownloadFormat,
  ContextLayerFormat,
  FourwingsInterval,
} from './datasets.configuration'
import type {
  DatasetFilterFormat,
  DatasetFilterOperation,
  DatasetFilterType,
} from './datasets.filters'
import { EventTypes } from './events'
import type { ThinningConfig } from './thinning'

export const DATASET_TYPES: ApiDataset['type'][] = Object.values(DatasetTypes)

export const DATASET_STATUS: ApiDataset['status'][] = Object.values(DatasetStatus)

export const DATASET_CATEGORIES: ApiDataset['category'][] = Object.values(DatasetCategory)

export const DATASET_SUB_CATEGORIES: ApiDataset['subcategory'][] = [
  ...Object.values(DatasetSubCategory),
  ...Object.values(EventTypes),
]

export const DATASET_DOCUMENTATION_STATUS_TYPES: DatasetDocumentationStatusTypes[] = Object.values(
  DatasetDocumentationStatusTypes
)

export const DATASET_CONFIGURATION_FILTERS: (keyof ApiDataset['filters'])[] = [
  'fourwings',
  'events',
  'tracks',
  'vessels',
]

export const DATASET_CONFIGURATION_FILTER_TYPES: DatasetFilterType[] = [
  'boolean',
  'coordinate',
  'number',
  'range',
  'sql',
  'string',
  'timestamp',
]

export const DATASET_CONFIGURATION_FILTER_FORMATS: DatasetFilterFormat[] = [
  'date-time',
  'latitude',
  'longitude',
]

export const DATASET_CONFIGURATION_FILTER_OPERATIONS: DatasetFilterOperation[] = [
  'gt',
  'lt',
  'gte',
  'lte',
]

export const DATASET_CONFIGURATION_CONTEXT_FORMATS: ContextLayerFormat[] = [
  'GEOJSON',
  'PMTILE',
  'CSV',
]

export const DATASET_CONFIGURATION_FUNCTIONS: AggregationFunction[] = ['AVG', 'SUM']
export const DATASET_CONFIGURATION_INTERVALS: FourwingsInterval[] = ['YEAR', 'MONTH', 'DAY', 'HOUR']
export const DATASET_CONFIGURATION_BULK_DOWNLOAD_FORMATS: BulkDownloadFormat[] = ['CSV', 'JSON']

export const THINNING_PARAMS: (keyof ThinningConfig)[] = [
  'distance-fishing',
  'distance-transit',
  'bearing-val-fishing',
  'bearing-val-transit',
  'change-speed-fishing',
  'change-speed-transit',
  'min-accuracy-fishing',
  'min-accuracy-transit',
]
