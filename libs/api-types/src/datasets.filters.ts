export type FilterType = 'fourwings' | 'events' | 'tracks' | 'vessels'

export type DatasetFilterType =
  | 'boolean'
  | 'coordinate'
  | 'number'
  | 'range'
  | 'sql'
  | 'string'
  | 'timestamp'

export type DatasetFilterFormat = 'date-time' | 'latitude' | 'longitude'
export type DatasetFilterUnit = 'hours' | 'minutes' | 'km' | 'SI'

export type DatasetFilterEnum = (string | number | boolean)[]
export type DatasetFilterOperation = 'gt' | 'lt' | 'gte' | 'lte'
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
