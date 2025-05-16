import { createSelector } from '@reduxjs/toolkit'

import { VESSEL_TRACK_DATAVIEW_TEMPLATES } from 'data/workspaces'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'

// Needed another file to avoid circular dependency
export const selectVesselTemplateDataviews = createSelector(
  [selectAllDataviews],
  (vesselDataviews) => {
    return vesselDataviews?.filter((dataview) =>
      VESSEL_TRACK_DATAVIEW_TEMPLATES.includes(dataview.slug as any)
    )
  }
)
