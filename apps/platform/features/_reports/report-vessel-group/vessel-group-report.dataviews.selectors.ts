import { createSelector } from '@reduxjs/toolkit'

import { FISHING_ALL_DATAVIEW_SLUG, PRESENCE_DATAVIEW_SLUG } from '@platform/config/map/dataviews'

import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import {
  selectFishingDataviews,
  selectPresenceDataviews,
} from 'features/_map/dataviews/selectors/dataviews.static.selectors'

import { getVesselGroupActivityDataview } from './vessel-group-report.dataviews'
import { selectVGRDatasets } from './vessel-group-report.slice'

// Not in vessel-group-report.slice: that slice is registered eagerly in store/reducers.ts, and
// vessel-group-report.dataviews pulls the datasets-client barrel into every page with it.

export const selectVGRPresenceDataview = createSelector(
  [selectVGRDatasets, selectPresenceDataviews, selectAllDatasets],
  (vesselGroupDatasets, presenceDataviews, allDatasets) =>
    getVesselGroupActivityDataview({
      vesselGroupDatasets,
      activityDataviews: presenceDataviews,
      allDatasets,
      fallbackDataviewSlug: PRESENCE_DATAVIEW_SLUG,
    })
)

export const selectVGRFishingDataview = createSelector(
  [selectVGRDatasets, selectFishingDataviews, selectAllDatasets],
  (vesselGroupDatasets, fishingDataviews, allDatasets) =>
    getVesselGroupActivityDataview({
      vesselGroupDatasets,
      activityDataviews: fishingDataviews,
      allDatasets,
      fallbackDataviewSlug: FISHING_ALL_DATAVIEW_SLUG,
    })
)
