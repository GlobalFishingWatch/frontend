import { createSelector } from '@reduxjs/toolkit'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectVesselEventsData } from 'features/vessel/vessel.slice'

export const selectVesselEventsFilteredByTimerange = createSelector(
  [selectVesselEventsData, selectTimeRange],
  (events, timerange) => {
    if (!timerange) return events
    return events?.filter((event) => {
      return event.start >= timerange.start && event.end <= timerange.end
    })
  }
)
