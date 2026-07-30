import { createSelector } from '@reduxjs/toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'

import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/map/datasets/datasets.utils'
import { selectDataviewInstancesResolvedVisible } from 'features/map/dataviews/selectors/dataviews.instances.selectors'
import { selectRealTimeLatestUpdate } from 'features/map/timebar/timebar.slice'
import { selectIsRealTimeMode } from 'features/map/workspace/workspace.selectors'

const EMPTY_ARRAY: [] = []

/**
 * Split out of app.selectors so that module stays a leaf.
 *
 * PlatformLayout reads selectReadOnly from app.selectors, which puts it in every page's entry chunk.
 * This selector is the only one there that reaches the dataview resolver cluster (and through it
 * datasets.utils and timebar.slice), so it lives here and is imported only by the map and report
 * components that actually need it.
 */
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
