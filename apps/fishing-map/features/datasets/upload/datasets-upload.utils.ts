import { ParseMeta } from 'papaparse'
import { capitalize, lowerCase } from 'lodash'
import { Dataset } from '@globalfishingwatch/api-types'
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
