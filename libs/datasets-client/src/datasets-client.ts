import {
  DRAW_DATASET_SOURCE,
  Dataset,
  DatasetConfiguration,
  DatasetConfigurationUI,
  DatasetGeometryType,
  TimeFilterType,
} from '@globalfishingwatch/api-types'

export type DataList = Record<string, any>[]

export type DatasetSchemaGeneratorProps = {
  data: DataList
}

export type DatasetConfigurationProperty = keyof DatasetConfigurationUI | keyof DatasetConfiguration
type DatasetProperty<P extends DatasetConfigurationProperty> = P extends 'geometryType'
  ? DatasetGeometryType
  : P extends 'timeFilter'
  ? TimeFilterType
  : string

export function getDatasetConfigurationProperty<P extends DatasetConfigurationProperty>({
  dataset,
  property,
}: {
  dataset: Partial<Dataset> | undefined
  property: P
}): DatasetProperty<P> {
  return (dataset?.configuration?.configurationUI?.[property as keyof DatasetConfigurationUI] ||
    dataset?.configuration?.[property as keyof DatasetConfiguration]) as DatasetProperty<P>
}

export const getDatasetConfiguration = (
  dataset: Partial<Dataset> | undefined
): DatasetConfiguration & DatasetConfiguration['configurationUI'] => ({
  ...dataset?.configuration,
  ...dataset?.configuration?.configurationUI,
})

export function getDatasetGeometryType(dataset?: Dataset): DatasetGeometryType {
  if (!dataset) {
    return '' as DatasetGeometryType
  }
  if (dataset?.source === DRAW_DATASET_SOURCE) {
    return 'draw'
  }
  return getDatasetConfigurationProperty({
    dataset,
    property: 'geometryType',
  })
}
