import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

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
