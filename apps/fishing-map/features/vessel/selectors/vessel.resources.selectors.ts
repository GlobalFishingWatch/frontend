import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { DatasetTypes, EventTypes } from '@globalfishingwatch/api-types'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselDatasetId } from 'features/vessel/vessel.config.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectVesselEventsData } from 'features/vessel/selectors/vessel.selectors'

export const selectVesselDataset = createSelector(
  [selectVesselDatasetId, selectAllDatasets],
  (vesselDatasetId, datasets) => {
    return datasets?.find((d) => d.id === vesselDatasetId)
  }
)

export const selectVesselHasEventsDatasets = createSelector([selectVesselDataset], (dataset) => {
  const vesselEventsDatasets = getRelatedDatasetsByType(dataset, DatasetTypes.Events)
  return vesselEventsDatasets ? vesselEventsDatasets.length > 0 : false
})

const selectVesselVisibleEventsData = createSelector(
  [selectVesselEventsData, selectVisibleEvents],
  (events, visibleEvents) => {
    if (visibleEvents === 'all') return events
    return events?.filter(({ type }) => visibleEvents.includes(type))
  }
)

export const selectVesselEventsDataWithVoyages = createSelector(
  [selectVesselVisibleEventsData],
  (events): ActivityEvent[] => {
    let voyage = 1
    return events?.map((event) => {
      const currentVoyage = voyage
      if (event.type === EventTypes.Port) {
        voyage++
      }
      return { ...event, voyage: currentVoyage }
    })
  }
)

export const selectVesselEventsFilteredByTimerange = createSelector(
  [selectVesselEventsDataWithVoyages, selectTimeRange],
  (events, timerange) => {
    const startMillis = DateTime.fromISO(timerange.start as string, { zone: 'utc' }).toMillis()
    const endMillis = DateTime.fromISO(timerange.end as string, { zone: 'utc' }).toMillis()
    if (!timerange) return events ?? []
    return (
      events?.filter((event) => {
        return (event.end as number) >= startMillis && (event.start as number) <= endMillis
      }) || []
    )
  }
)

export const selectVesselEventsByType = (type: EventTypes) =>
  createSelector([selectVesselEventsFilteredByTimerange], (events) => {
    return events.filter((event) => event.type === type)
  })
