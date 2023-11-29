import { ParseMeta } from 'papaparse'
import { capitalize, lowerCase } from 'lodash'
import {
  Dataset,
  DatasetConfiguration,
  DatasetConfigurationUI,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'
import { DataList } from 'features/datasets/upload/datasets-parse.utils'
import { DatasetMetadata } from './NewDataset'

export function getFileName(file: File): string {
  const name =
    file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name
  return capitalize(lowerCase(name))
}

export type DatasetSchemaGeneratorProps = {
  data: DataList
  meta: ParseMeta
}

export type VesselConfigurationProperty = keyof DatasetConfigurationUI | keyof DatasetConfiguration
type DatasetProperty<P extends VesselConfigurationProperty> = P extends 'geometryType'
  ? DatasetGeometryType
  : string

export function getDatasetConfigurationProperty<P extends VesselConfigurationProperty>({
  dataset,
  property,
}: {
  dataset: Dataset | DatasetMetadata | undefined
  property: P
}): DatasetProperty<P> {
  return (dataset?.configuration?.configurationUI?.[property as keyof DatasetConfigurationUI] ||
    dataset?.configuration?.[property as keyof DatasetConfiguration]) as DatasetProperty<P>
}

export const getDatasetConfiguration = (
  dataset: Dataset | DatasetMetadata | undefined
): DatasetConfiguration & DatasetConfiguration['configurationUI'] => ({
  ...dataset?.configuration,
  ...dataset?.configuration?.configurationUI,
})
