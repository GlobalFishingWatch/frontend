import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { LayerPropertiesOption } from 'features/workspace/shared/LayerProperties'

export const POLYGON_PROPERTIES: LayerPropertiesOption[] = ['color', 'thickness']
export const POINT_PROPERTIES: LayerPropertiesOption[] = ['color']

export const isHistogramDataviewSupported = (dataview: UrlDataviewInstance) => {
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
