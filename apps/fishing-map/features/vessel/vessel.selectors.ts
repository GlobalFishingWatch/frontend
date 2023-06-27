import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectVesselEventsData, selectVesselInfoData } from 'features/vessel/vessel.slice'

export const selectVesselEventsFilteredByTimerange = createSelector(
  [selectVesselEventsData, selectTimeRange],
  (events, timerange) => {
    const startMillis = DateTime.fromISO(timerange.start as string, { zone: 'utc' }).toMillis()
    const endMillis = DateTime.fromISO(timerange.end as string, { zone: 'utc' }).toMillis()
    if (!timerange) return events ?? []
    return (
      events?.filter((event) => {
        return event.start >= startMillis && event.end <= endMillis
      }) || []
    )
  }
)

export const selectVesselInfoDataMerged = createSelector([selectVesselInfoData], (vesselInfo) => {
  const vesselInfoMerged = {
    ...vesselInfo,
    ...vesselInfo?.vesselRegistryInfo?.[0],
    ...vesselInfo?.vesselRegistryOwners?.[0],
  }

  return vesselInfoMerged
})
