import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectVesselEventsData } from 'features/vessel/vessel.slice'

export const selectVesselEventsFilteredByTimerange = createSelector(
  [selectVesselEventsData, selectTimeRange],
  (events, timerange) => {
    const startMillis = DateTime.fromISO(timerange.start as string, { zone: 'utc' }).toMillis()
    const endMillis = DateTime.fromISO(timerange.end as string, { zone: 'utc' }).toMillis()
    if (!timerange) return events ?? []
    return (
      events?.filter((event) => {
        return (event.start as number) >= startMillis && (event.end as number) <= endMillis
      }) || []
    )
  }
)
