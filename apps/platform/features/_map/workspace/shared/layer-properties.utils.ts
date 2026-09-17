import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { LayerPropertiesOption } from 'features/_map/workspace/shared/LayerProperties'

export const POLYGON_PROPERTIES: LayerPropertiesOption[] = ['color', 'thickness']
export const POINT_PROPERTIES: LayerPropertiesOption[] = ['color']

export const isHistogramDataviewSupported = (dataview: UrlDataviewInstance) => {
  if (
    dataview.category === DataviewCategory.Activity ||
    dataview.category === DataviewCategory.Detections
  ) {
    // no min/max in the dataset configuration, the range comes from the layer color scale at runtime
    return true
  }
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
  const { max, min } = getDatasetConfiguration(dataset)
  return (
    max !== undefined &&
    min !== undefined &&
    max !== null &&
    min !== null &&
    (max !== 0 || min !== 0)
  )
}
