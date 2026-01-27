import { createSelector } from '@reduxjs/toolkit'

import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from 'data/workspaces'
import { VMS_VESSEL_DATAVIEW_SLUGS } from 'data/workspaces-vms'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'

const VESSEL_TRACK_DATAVIEW_TEMPLATES = [
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
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
