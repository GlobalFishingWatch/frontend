import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { sortStrings } from 'utils/shared'

const getSerializedDatasets = (dataview: UrlDataviewInstance) => {
  return dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
}

export const getHasAllSourcesInCommon = (dataviews: UrlDataviewInstance[]): boolean => {
  const firstDataviewDatasets = getSerializedDatasets(dataviews[0])
  return dataviews?.every((dataview) => {
    const datasets = getSerializedDatasets(dataview)
    return datasets === firstDataviewDatasets
  })
}
