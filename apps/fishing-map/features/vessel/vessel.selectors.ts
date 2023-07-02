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
        return (event.start as number) >= startMillis && (event.end as number) <= endMillis
      }) || []
    )
  }
)

export const selectVesselInfoDataMerged = createSelector([selectVesselInfoData], (vesselInfo) => {
  if (!vesselInfo) {
    return null
  }
  return {
    ...vesselInfo,
    firstTransmissionDate: vesselInfo?.firstTransmissionDate || '',
    // Make sure to have the lastest in the first position
    vesselRegistryInfo:
      vesselInfo?.vesselRegistryInfo?.sort(
        (a, b) => Number(b.latestVesselInfo) - Number(a.latestVesselInfo)
      ) || [],
  }
})
