import { createSelector } from '@reduxjs/toolkit'

import { selectSettings } from 'features/settings/settings.slice'

import { selectEventsWithRenderingInfo } from './vessels-activity.selectors'
import {
  filterActivityHighlightEvents,
  isAnyHighlightsSettingDefined,
} from './vessels-highlight.worker'

export const selectActivityHighlightEvents = createSelector(
  [selectEventsWithRenderingInfo, selectSettings],
  filterActivityHighlightEvents
)

export const selectAnyHighlightsSettingDefined = createSelector(
  [selectSettings],
  isAnyHighlightsSettingDefined
)
