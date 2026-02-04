import { uniq } from 'es-toolkit'
import type { FeatureCollection } from 'geojson'
import max from 'lodash/max'
import min from 'lodash/min'
import snakeCase from 'lodash/snakeCase'

import type {
  Dataset,
  DatasetFilter,
  DatasetFilters,
  DatasetFilterType,
  FrontendConfiguration,
} from '@globalfishingwatch/api-types'
import { getFlattenDatasetFilters } from '@globalfishingwatch/datasets-client'

import { parseCoords } from '../coordinates'
import { COORDINATES_PROPERTIES_ID } from '../segments/segments-to-geojson'

import { GUESS_COLUMN_DICT } from './guess-columns'

type GetFieldFilterParams = {
  includeEnum?: boolean
  maxFilterEnumValues?: number
}

export const MAX_FILTERS_ENUM_VALUES = 100
export const MAX_FILTERS_ENUM_VALUES_EXCEEDED = 'maximum values exceeded'

export function getFilterIdClean(id: string): string
export function getFilterIdClean(id: string[]): string[]
export function getFilterIdClean(id: string | string[]): string | string[] {
  if (Array.isArray(id)) {
    return id.map((d) => snakeCase(d))
  }
  // TODO review how backend handles characters like -
  // so we can parse the same here or before uploading the dataset
  return id === COORDINATES_PROPERTIES_ID ? id : snakeCase(id)
}

export const normalizePropertiesKeys = (object: Record<string, any> | null) => {
  return Object.entries(object || {}).reduce(
    (acc, [key, value]) => {
      const normalizedKey = getFilterIdClean(key) as string
      acc[normalizedKey] = value
      return acc
    },
    {} as Record<string, any>
  )
}

function getTimestampEnum(values: any[]): DatasetFilter['enum'] {
  const valuesOrdered = values.sort((a, b) => a - b)
  return [
    new Date(valuesOrdered[0]).getTime(),
    new Date(valuesOrdered[valuesOrdered.length - 1]).getTime(),
  ]
}

export const getFieldFilter = (
  field: string,
  values: any[],
  { includeEnum, maxFilterEnumValues = MAX_FILTERS_ENUM_VALUES } = {} as GetFieldFilterParams
): DatasetFilter | null => {
  // As soon as we find a string, there are no compatibility with others
  // this is needed because there are cases where are mixed types in the same column
  const isStringType = values.some((d) => typeof d === 'string')
  const type = isStringType ? 'string' : (typeof values[0] as DatasetFilterType | 'object')
  if (type === 'object') {
    if (values[0] instanceof Date) {
      const filter: DatasetFilter = {
        id: field,
        label: field,
        type: 'timestamp',
      }
      if (includeEnum && values.length > 1) {
        filter.enum = getTimestampEnum(values)
      }
      return filter
    }
    return null
  }

  if (values?.length) {
    const filterType: DatasetFilterType =
      GUESS_COLUMN_DICT.latitude.some((t) => t === field) ||
      GUESS_COLUMN_DICT.longitude.some((t) => t === field)
        ? 'coordinate'
        : type === 'number'
          ? 'range'
          : type === 'boolean'
            ? 'boolean'
            : type === 'string'
              ? 'string'
              : 'number'
    const filter: DatasetFilter = {
      id: field,
      label: field,
      type: filterType,
    }
    if (includeEnum && values?.length > 1) {
      if (filter.type === 'string') {
        const isDates = values.every((d) => !isNaN(Date.parse(d)))
        const isNumeric = values.every((d) => parseCoords(d, d))
        if (isDates) {
          filter.type = 'timestamp'
          filter.enum = getTimestampEnum(values)
        } else if (isNumeric) {
          const numericalValues = values.filter((v) => !isNaN(Number(v)))
          if (!numericalValues.length) return filter
          const valuesOrdered = numericalValues.sort((a, b) => a - b)
          filter.type = 'range'
          filter.enum = [valuesOrdered[0], valuesOrdered[valuesOrdered.length - 1]]
        } else {
          const stringEnumSupported = values.length < maxFilterEnumValues
          filter.enum = stringEnumSupported
            ? values.map((v) => v.toString())
            : [MAX_FILTERS_ENUM_VALUES_EXCEEDED]
        }
      } else if (filter.type === 'range' || filter.type === 'coordinate') {
        const numericalValues = values.filter((v) => !isNaN(v))
        filter.enum = [min(numericalValues), max(numericalValues)]
      } else if (filter.type === 'boolean') {
        filter.enum = [true, false]
      }
    }
    return filter
  }
  return null
}

export const getDatasetFiltersClean = (filters?: DatasetFilter[]): DatasetFilter[] => {
  if (!filters || filters.length === 0) {
    return []
  }
  return filters.map((filter) => {
    return { ...filter, id: getFilterIdClean(filter.id), label: filter.label || filter.id }
  })
}

const CONFIGURATION_KEYS_TO_CLEAN: (keyof FrontendConfiguration)[] = [
  'startTime',
  'endTime',
  'timestamp',
  'pointName',
  'pointSize',
  'polygonColor',
  'lineId',
  'segmentId',
]
export const getDatasetConfigurationClean = (
  configuration?: Dataset['configuration']
): Dataset['configuration'] => {
  if (!configuration) {
    return {} as Dataset['configuration']
  }
  const frontend = Object.entries(configuration.frontend || {}).reduce((acc, [key, value]) => {
    const cleanValue = CONFIGURATION_KEYS_TO_CLEAN.includes(key as keyof FrontendConfiguration)
      ? typeof value === 'string' || Array.isArray(value)
        ? getFilterIdClean(value as string)
        : value
      : value
    return { ...acc, [key]: cleanValue }
  }, {} as FrontendConfiguration)
  return {
    ...(configuration || {}),
    frontend,
  } as Dataset['configuration']
}

export const getDatasetFiltersFromGeojson = (
  geojson: FeatureCollection,
  getFieldFilterParams = {} as GetFieldFilterParams
): DatasetFilter[] => {
  const fields = geojson?.features?.[0]?.properties && Object.keys(geojson.features[0].properties)
  if (!fields?.length) {
    return []
  }
  const filters: DatasetFilter[] = fields.flatMap((field) => {
    const uniqDataValues = uniq(geojson.features.flatMap((d) => d.properties?.[field] || []))
    const filter = getFieldFilter(field, uniqDataValues, getFieldFilterParams)
    if (!filter) {
      return []
    }
    const cleanField = snakeCase(field)
    return { ...filter, id: cleanField, label: filter.label || cleanField }
  })
  return filters
}

type ListedData = Record<string, any>[]
export const getDatasetFiltersFromList = (
  data: ListedData,
  getFieldFilterParams = {} as GetFieldFilterParams
): DatasetFilter[] => {
  const fields = Object.keys(data[0])
  if (!fields?.length) {
    return []
  }
  const filters: DatasetFilter[] = fields.flatMap((field) => {
    const uniqDataValues = uniq(data.flatMap((d) => d[field] || []))
    const filter = getFieldFilter(field, uniqDataValues, getFieldFilterParams)
    if (!filter) {
      return []
    }
    const cleanField = getFilterIdClean(field)
    return { ...filter, id: cleanField, label: filter.label || cleanField }
  })
  return filters
}

export const getDatasetFilters = (
  data: ListedData | FeatureCollection,
  getFieldFilterParams = {} as GetFieldFilterParams
): DatasetFilter[] => {
  if (Array.isArray(data)) {
    return getDatasetFiltersFromList(data, getFieldFilterParams)
  } else if (data.type === 'FeatureCollection') {
    return getDatasetFiltersFromGeojson(data, getFieldFilterParams)
  }
  return []
}
