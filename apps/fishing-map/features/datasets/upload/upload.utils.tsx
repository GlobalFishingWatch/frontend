import { ParseMeta } from 'papaparse'
import { Dataset, DatasetSchemaItem } from '@globalfishingwatch/api-types'
import { CSV } from './NewTrackDataset'
import { DatasetMetadata } from './NewDataset'

export type DatasetSchemaGeneratorProps = {
  data: CSV
  meta: ParseMeta
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
            [field]: { type: typeof dataWithValue[field] } as DatasetSchemaItem,
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
  return (
    datasetMetadata?.configuration?.configurationUI?.[property] ||
    datasetMetadata?.configuration?.[property]
  )
}

export const getDatasetConfiguration = ({
  datasetMetadata,
}: {
  datasetMetadata: DatasetMetadata | undefined
}): Dataset['configuration'] => ({
  ...datasetMetadata?.configuration,
  ...datasetMetadata?.configuration?.configurationUI,
})
