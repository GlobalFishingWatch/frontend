import type { DataviewDatasetConfig } from '@globalfishingwatch/api-types'
import type { GetDatasetConfigCallback } from '@globalfishingwatch/dataviews-client'

import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { CACHE_FALSE_PARAM } from 'features/vessel/vessel.config'

export const infoDatasetConfigsCallback = (guestUser: boolean): GetDatasetConfigCallback => {
  return ([info]: DataviewDatasetConfig[]): DataviewDatasetConfig[] => {
    const vesselData = hasDatasetConfigVesselData(info)
    // Clean resources when mandatory vesselId is missing
    // needed for vessels with no info datasets (zebraX)
    if (!vesselData) {
      return []
    }
    if (guestUser) {
      return [{ ...info, query: [...(info.query || []), CACHE_FALSE_PARAM] }]
    }
    return [info]
  }
}
