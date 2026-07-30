import { createSelector } from '@reduxjs/toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'

import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/_map/datasets/datasets.utils'
import { selectDataviewInstancesResolvedVisible } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { selectRealTimeLatestUpdate } from 'features/_map/timebar/timebar.slice'
import { selectIsRealTimeMode } from 'features/_map/workspace/workspace.selectors'

const EMPTY_ARRAY: [] = []

export const selectLatestAvailableDataDate = createSelector(
  [selectIsRealTimeMode, selectRealTimeLatestUpdate, selectDataviewInstancesResolvedVisible],
  (isRealTimeMode, realTimeLatestUpdate, dataviews) => {
    if (isRealTimeMode && realTimeLatestUpdate) {
      return realTimeLatestUpdate
    }
    const activeDatasets = dataviews?.flatMap((dataview) => {
      if (!dataview || dataview.category === DataviewCategory.Context) {
        return EMPTY_ARRAY
      } else if (
        dataview.category === DataviewCategory.Activity ||
        dataview.category === DataviewCategory.Detections
      ) {
        return getActiveActivityDatasetsInDataviews([dataview]).flat()
      }
      return dataview.datasets || []
    }) as Dataset[]
    return getLatestEndDateFromDatasets(activeDatasets)
  }
)
