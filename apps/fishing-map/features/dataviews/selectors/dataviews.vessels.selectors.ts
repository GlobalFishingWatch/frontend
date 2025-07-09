import { createSelector } from '@reduxjs/toolkit'

import {
  PRIVATE_TEMPLATE_VESSEL_DATAVIEW_SLUGS,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
} from 'data/workspaces'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'

const VESSEL_TRACK_DATAVIEW_TEMPLATES = [
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
  ...Object.values(PRIVATE_TEMPLATE_VESSEL_DATAVIEW_SLUGS),
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
