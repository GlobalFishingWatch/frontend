import { ParseMeta } from 'papaparse'
import { capitalize, lowerCase, uniq } from 'lodash'
import { Dataset, DatasetSchemaItem } from '@globalfishingwatch/api-types'
import { CSV } from './NewTrackDataset'
import { DatasetMetadata } from './NewDataset'

export function getFileName(file: File): string {
  const name =
    file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name
  return capitalize(lowerCase(name))
}

export type DatasetSchemaGeneratorProps = {
  data: CSV
  meta: ParseMeta
}

export const getDatasetSchemaFromGeojson = (geojson: any) => {
  const fields = geojson?.features?.[0]?.properties && Object.keys(geojson.features[0].properties)
  console.log('🚀 ~ getDatasetSchemaFromGeojson ~ fields:', fields)
  return fields.reduce((acc: Dataset['schema'], field: string): Dataset['schema'] => {
    return {
      ...acc,
      [field]: {
        type: typeof geojson.features[0].properties[field],
        // TODO
        // enum:
        //   typeof geojson.features[0].properties[field] === 'string'
        //     ? uniq(geojson.features.map((f: any) => f.properties[field]))
        //     : [],
      } as DatasetSchemaItem,
    }
  }, {})
}

export const getDatasetSchemaFromCSV = ({ data, meta }: DatasetSchemaGeneratorProps) => {
  const fields = meta?.fields
  const schema =
    fields &&
    (fields.reduce((acc: Dataset['schema'], field: string): Dataset['schema'] => {
      const dataWithValue = data.find((d: any) => d[field])
      return dataWithValue
        ? {
            ...acc,
            [field]: {
              type: typeof dataWithValue[field],
              enum:
                typeof dataWithValue[field] === 'string' && field !== 'timestamp'
                  ? uniq(data.map((d) => d[field]))
                  : [],
            } as DatasetSchemaItem,
          }
        : acc
    }, {}) as Dataset['schema'])
  return schema
}

export const getDatasetConfigurationProperty = ({
  datasetMetadata,
  property,
}: {
  datasetMetadata: DatasetMetadata | undefined
  property: string
}) => {
  return (datasetMetadata?.configuration?.configurationUI?.[property] ||
    datasetMetadata?.configuration?.[property]) as string
}

export const getDatasetConfiguration = ({
  datasetMetadata,
}: {
  datasetMetadata: DatasetMetadata | undefined
}): Dataset['configuration'] => ({
  ...datasetMetadata?.configuration,
  ...datasetMetadata?.configuration?.configurationUI,
})
