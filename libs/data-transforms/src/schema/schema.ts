import { max, min, uniq } from 'lodash'
import { FeatureCollection } from 'geojson'
import { Dataset, DatasetSchemaItem, DatasetSchemaType } from '@globalfishingwatch/api-types'
import { parseCoords } from '../coordinates'
import { GUESS_COLUMN_DICT } from './guess-columns'

type GetFieldSchemaParams = {
  includeEnum?: boolean
  maxSchemaEnumValues?: number
}
const MAX_SCHEMA_ENUM_VALUES = 100

export const getFieldSchema = (
  field: string,
  values: any[],
  { includeEnum, maxSchemaEnumValues = MAX_SCHEMA_ENUM_VALUES } = {} as GetFieldSchemaParams
): DatasetSchemaItem | null => {
  // As soon as we find a string, there are no compatibility with others
  // this is needed because there are cases where are mixed types in the same column
  const isStringType = values.some((d) => typeof d === 'string')
  const type = isStringType ? 'string' : (typeof values[0] as DatasetSchemaType)

  if (values?.length) {
    let schema: DatasetSchemaItem = {
      type:
        GUESS_COLUMN_DICT.latitude.some((t) => t === field) ||
        GUESS_COLUMN_DICT.longitude.some((t) => t === field)
          ? 'coordinate'
          : type === 'number'
          ? 'range'
          : type,
    }
    if (includeEnum && values?.length > 1) {
      if (schema.type === 'string') {
        const isDates = values.every((d) => !isNaN(Date.parse(d)))
        const isNumeric = values.some((d) => parseCoords(d, d))
        if (isDates) {
          const valuesOrdered = values.sort((a, b) => a - b)
          schema.type = 'timestamp'
          schema.enum = [
            new Date(valuesOrdered[0]).getTime(),
            new Date(valuesOrdered[valuesOrdered.length - 1]).getTime(),
          ]
        } else if (isNumeric) {
          const numericalValues = values.filter((v) => !isNaN(Number(v)))
          const valuesOrdered = numericalValues.sort((a, b) => a - b)
          schema.type = 'range'
          schema.enum = [valuesOrdered[0], valuesOrdered[valuesOrdered.length - 1]]
        } else {
          const stringEnumSupported = values.length < maxSchemaEnumValues
          schema.enum = stringEnumSupported ? values.map((v) => v.toString()) : []
        }
      } else if (schema.type === 'range' || schema.type === 'coordinate') {
        const numericalValues = values.filter((v) => !isNaN(v))
        schema.enum = [min(numericalValues), max(numericalValues)]
      } else if (schema.type === 'boolean') {
        schema.enum = [true, false]
      }
    }
    return schema
  }
  return null
}

export const getSchemaIdClean = (id: string) => {
  // TODO review how backend handles characters like -
  // so we can parse the same here or before uploading the dataset
  return id?.replace(/-/g, '_')?.toLowerCase()
}

export const getDatasetSchemaFromGeojson = (
  geojson: FeatureCollection,
  getFieldSchemaParams = {} as GetFieldSchemaParams
) => {
  const fields = geojson?.features?.[0]?.properties && Object.keys(geojson.features[0].properties)
  if (!fields?.length) {
    return {} as Dataset['schema']
  }
  const schema: Dataset['schema'] = fields.reduce(
    (acc: Dataset['schema'], field: string): Dataset['schema'] => {
      const uniqDataValues = uniq(geojson.features.flatMap((d) => d.properties?.[field] || []))
      const schema = getFieldSchema(field, uniqDataValues, getFieldSchemaParams)
      if (schema) {
        return { ...acc, [field.toLowerCase()]: schema }
      }
      return acc
    },
    {}
  )
  return schema
}

type ListedData = Record<string, any>[]
export const getDatasetSchemaFromList = (
  data: ListedData,
  getFieldSchemaParams = {} as GetFieldSchemaParams
) => {
  const fields = Object.keys(data[0])
  if (!fields?.length) {
    return {} as Dataset['schema']
  }
  const schema: Dataset['schema'] = fields.reduce(
    (acc: Dataset['schema'], field: string): Dataset['schema'] => {
      const cleanField = getSchemaIdClean(field)
      const uniqDataValues = uniq(data.flatMap((d) => d[field] || []))
      const schema = getFieldSchema(cleanField, uniqDataValues, getFieldSchemaParams)
      if (schema) {
        return { ...acc, [cleanField]: schema }
      }
      return acc
    },
    {}
  )
  return schema
}

export const getDatasetSchema = (
  data: ListedData | FeatureCollection,
  getFieldSchemaParams = {} as GetFieldSchemaParams
) => {
  if (Array.isArray(data)) {
    return getDatasetSchemaFromList(data, getFieldSchemaParams)
  } else if (data.type === 'FeatureCollection') {
    return getDatasetSchemaFromGeojson(data, getFieldSchemaParams)
  }
  return {} as Dataset['schema']
}
