import { createSelector } from '@reduxjs/toolkit'
import {
  resolveDataviewDatasetResource,
  resolveDataviewEventsResources,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.selectors'
import { ActivityEvent } from 'types/activity'

export const selectEventsForTracks = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    // const visibleEvents: (EventType[] | 'all') = 'all'
    const vesselsEvents = trackDataviews.map((dataview) => {
      const { url: tracksUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      // const { url: eventsUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Events)
      const eventsResources = resolveDataviewEventsResources(dataview)
      const hasEventData =
        eventsResources?.length && eventsResources.every(({ url }) => resources[url]?.data)
      const tracksResourceResolved =
        tracksUrl && resources[tracksUrl]?.status === ResourceStatus.Finished

      // Waiting for the tracks resource to be resolved to show the events
      if (
        !hasEventData ||
        !tracksResourceResolved //||
        // (Array.isArray(visibleEvents) && visibleEvents?.length === 0)
      ) {
        return { dataview, data: [] }
      }

      const eventsResourcesFiltered = eventsResources
      // .filter(({ dataset }) => {
      //   if (visibleEvents === 'all') {
      //     return true
      //   }
      //   return (
      //     dataset.configuration?.type &&
      //     visibleEvents?.includes(dataset.configuration?.type))
      //   )
      // })

      const data = eventsResourcesFiltered.flatMap(({ url }) => {
        if (!url || !resources[url].data) {
          return []
        }

        return resources[url].data as ActivityEvent[]
      })
      return { dataview, data }
    })
    return vesselsEvents
  }
)
