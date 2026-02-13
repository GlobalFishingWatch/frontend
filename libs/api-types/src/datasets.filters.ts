export const DATASET_FILTERS = [
  'constLayers',
  'events',
  'fourwings',
  'tracks',
  'userContextLayers',
  'vessels',
] as const

export const DATASET_CONFIGURATION_FILTER_TYPES = [
  'boolean',
  'coordinate',
  'timestamp',
  'number',
  'range',
  'sql',
  'string',
] as const

export const DATASET_CONFIGURATION_FILTER_FORMATS = ['date-time', 'latitude', 'longitude'] as const
export const DATASET_CONFIGURATION_FILTER_UNIT = ['hours', 'minutes', 'km', 'SI'] as const
export const DATASET_CONFIGURATION_FILTER_OPERATION = ['gt', 'lt', 'gte', 'lte'] as const

export type DatasetFilterType = (typeof DATASET_CONFIGURATION_FILTER_TYPES)[number]
export type FilterType = (typeof DATASET_FILTERS)[number]
export type DatasetFilterFormat = (typeof DATASET_CONFIGURATION_FILTER_FORMATS)[number]
export type DatasetFilterUnit = (typeof DATASET_CONFIGURATION_FILTER_UNIT)[number]
export type DatasetFilterEnum = (string | number | boolean)[]
export type DatasetFilterOperation = (typeof DATASET_CONFIGURATION_FILTER_OPERATION)[number]

export type DatasetFilter = {
  label: string
  id: string
  type: DatasetFilterType
  required?: boolean
  enabled?: boolean
  array?: boolean
  enum?: DatasetFilterEnum
  format?: DatasetFilterFormat
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  singleSelection?: boolean
  operation?: DatasetFilterOperation
  unit?: DatasetFilterUnit
}

export type DatasetFilters = Partial<Record<FilterType, DatasetFilter[]>>
