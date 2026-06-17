import { createSelector } from '@reduxjs/toolkit'

import { PRESENCE_DATAVIEW_SLUG, VESSEL_TEMPLATE_DATAVIEW_SLUGS } from 'data/workspaces'
import { VMS_VESSEL_DATAVIEW_SLUGS } from 'data/workspaces-vms'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'

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
