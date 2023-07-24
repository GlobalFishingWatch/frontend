import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { resolveDataviewDatasetResources } from '@globalfishingwatch/dataviews-client'
import { ApiEvent, DatasetTypes, EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { selectResources } from 'features/resources/resources.slice'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { VesselProfileActivityMode, VesselProfileStateProperty } from 'types'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

export const selectVesselProfileStateProperty = (property: VesselProfileStateProperty) =>
  createSelector([selectQueryParam(property)], (urlProperty) => {
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_VESSEL_STATE[property]
  })

export const selectVesselDatasetId = createSelector(
  [selectVesselProfileStateProperty('vesselDatasetId')],
  (vesselDatasetId): string => {
    return vesselDatasetId
  }
)
export const selectVesselActivityMode = createSelector(
  [selectVesselProfileStateProperty('vesselActivityMode')],
  (vesselActivityMode): VesselProfileActivityMode => {
    return vesselActivityMode
  }
)

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
  (eventsResources, vessel) => {
    const vesselProfileEventResources = eventsResources?.filter((r) => {
      const isLoaded = r.status === ResourceStatus.Finished
      const isVesselResource = r.datasetConfig?.query?.some(
        (q) => q.id === 'vessels' && q.value === vessel?.id
      )
      return isVesselResource && isLoaded
    })
    return vesselProfileEventResources
      ?.flatMap((r) => (r.data as ApiEvent[]) || [])
      .sort((a, b) => (a.start > b.start ? -1 : 1))
  }
)

export const selectVesselEventsDataWithVoyages = createSelector(
  [selectVesselEventsData],
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

export const selectOngoingVoyageId = createSelector(
  [selectVesselEventsDataWithVoyages],
  (eventsWithVoyages): ActivityEvent['voyage'] => {
    return eventsWithVoyages[0]?.voyage
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
