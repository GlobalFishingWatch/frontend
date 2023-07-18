import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { resolveDataviewDatasetResources } from '@globalfishingwatch/dataviews-client'
import { ApiEvent, DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { selectResources } from 'features/resources/resources.slice'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'

export const selectEventsResources = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    return trackDataviews?.flatMap((dataview) => {
      return resolveDataviewDatasetResources(dataview, DatasetTypes.Events).flatMap(
        (eventResource) => {
          return resources[eventResource.url] || []
        }
      )
    })
  }
)

export const selectVesselEventsData = createSelector(
  [selectEventsResources, selectVesselInfoData],
  (trackResources, vessel) => {
    const vesselProfileEventResources = trackResources?.filter((r) => {
      const isLoaded = r.status === ResourceStatus.Finished
      const isVesselResource = r.datasetConfig?.query?.some(
        (q) => q.id === 'vessels' && q.value === vessel?.id
      )
      return isVesselResource && isLoaded
    })
    return vesselProfileEventResources?.flatMap((r) => (r.data as ApiEvent[]) || [])
  }
)

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
