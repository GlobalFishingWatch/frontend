import { createSelector } from '@reduxjs/toolkit'

import {
  FISHING_DATAVIEW_SLUG_ALL,
  PRESENCE_DATAVIEW_SLUG,
  VESSEL_TEMPLATE_DATAVIEW_SLUGS,
} from 'data/map/workspaces'
import { VMS_VESSEL_DATAVIEW_SLUGS } from 'data/map/workspaces-vms'
import { selectAllDataviews } from 'features/_map/dataviews/dataviews.slice'

const VESSEL_TRACK_DATAVIEW_TEMPLATES = [
  ...VESSEL_TEMPLATE_DATAVIEW_SLUGS,
  ...Object.values(VMS_VESSEL_DATAVIEW_SLUGS),
]

// Needed another file to avoid circular dependency
export const selectVesselTemplateDataviews = createSelector(
  [selectAllDataviews],
  (vesselDataviews) => {
    return vesselDataviews?.filter((dataview) =>
      VESSEL_TRACK_DATAVIEW_TEMPLATES.includes(dataview.slug as any)
    )
  }
)

export const selectPresenceDataview = createSelector([selectAllDataviews], (dataviews = []) => {
  return dataviews.find((dataview) => dataview.slug === PRESENCE_DATAVIEW_SLUG)
})

export const selectFishingDataview = createSelector([selectAllDataviews], (dataviews = []) => {
  return dataviews.find((dataview) => dataview.slug === FISHING_DATAVIEW_SLUG_ALL)
})
