import { useCallback, useMemo } from 'react'
import { uniqBy } from 'lodash'
import { useSelector } from 'react-redux'
import { EventType } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { getEventsDatasetsInDataview } from 'features/datasets/datasets.utils'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import { useLocationConnect } from 'routes/routes.hook'

export const useVesselEvents = (dataviews = [] as UrlDataviewInstance[]) => {
  const { dispatchQueryParams } = useLocationConnect()
  const currentVisibleEvents = useSelector(selectVisibleEvents)
  const vesselDataviews = useSelector(selectVesselsDataviews)

  const eventDatasets = uniqBy(
    (dataviews?.length ? dataviews : vesselDataviews)?.flatMap((dataview) =>
      getEventsDatasetsInDataview(dataview)
    ),
    'id'
  )

  const allEventTypes = eventDatasets.flatMap((dataset) => dataset.subcategory || [])
  const setVesselEventVisibility = useCallback(
    ({ event, visible }: { event: EventType; visible: boolean }) => {
      if (visible) {
        const visibleEvents: any =
          currentVisibleEvents === 'all'
            ? allEventTypes.filter((eventType) => eventType !== event)
            : [...(currentVisibleEvents === 'none' ? [] : currentVisibleEvents), event]
        dispatchQueryParams({
          visibleEvents: visibleEvents?.length === allEventTypes.length ? 'all' : visibleEvents,
        })
      } else {
        const currentVisibleEventsTypes =
          currentVisibleEvents === 'all'
            ? allEventTypes
            : currentVisibleEvents === 'none'
            ? []
            : currentVisibleEvents
        const visibleEvents = currentVisibleEventsTypes.filter(
          (eventType) => event !== eventType
        ) as EventType[]
        dispatchQueryParams({
          visibleEvents: visibleEvents?.length ? visibleEvents : 'none',
        })
      }
    },
    [dispatchQueryParams, allEventTypes, currentVisibleEvents]
  )

  return useMemo(
    () => ({ visibleEvents: currentVisibleEvents, setVesselEventVisibility }),
    [currentVisibleEvents, setVesselEventVisibility]
  )
}
