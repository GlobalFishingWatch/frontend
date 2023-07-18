import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'lodash'
import { selectFilteredEvents } from 'features/vessel/activity/vessels-activity.selectors'

export const selectEventsByType = createSelector([selectFilteredEvents], (eventsList) => {
  return groupBy(eventsList, 'type')
})
