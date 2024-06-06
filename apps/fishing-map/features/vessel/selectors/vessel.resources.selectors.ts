import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { resolveDataviewDatasetResources } from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, EventTypes } from '@globalfishingwatch/api-types'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { selectResources } from 'features/resources/resources.slice'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselDatasetId } from 'features/vessel/vessel.config.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  selectSelfReportedVesselIds,
  selectVesselEventsData,
} from 'features/vessel/selectors/vessel.selectors'

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

export const selectResourcesByType = (type: DatasetTypes) =>
  createSelector([selectActiveTrackDataviews, selectResources], (trackDataviews, resources) => {
    return trackDataviews?.flatMap((dataview) => {
      return resolveDataviewDatasetResources(dataview, type).flatMap((eventResource) => {
        return resources[eventResource.url] || []
      })
    })
  })

export const selectEventsResources = createSelector(
  [selectResourcesByType(DatasetTypes.Events)],
  (events) => events
)

export const selectTrackResources = createSelector(
  [selectResourcesByType(DatasetTypes.Tracks)],
  (events) => events
)
export const selectVesselVisibleEventsData = createSelector(
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

export const selectHasVesselEventsFilteredByTimerange = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (events) => {
    return events?.length > 0
  }
)

export const selectVesselEventsByType = (type: EventTypes) =>
  createSelector([selectVesselEventsFilteredByTimerange], (events) => {
    return events.filter((event) => event.type === type)
  })
