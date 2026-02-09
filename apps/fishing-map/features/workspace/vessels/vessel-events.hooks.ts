import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import type { EventType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'

import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { replaceQueryParams } from 'routes/routes.actions'

const ALL_EVENT_TYPES = [
  EventTypes.Fishing,
  EventTypes.Loitering,
  EventTypes.Encounter,
  EventTypes.Port,
  EventTypes.Gap,
]

export const useVisibleVesselEvents = () => {
  const currentVisibleEvents = useSelector(selectVisibleEvents)

  const setVesselEventVisibility = useCallback(
    ({ event, visible }: { event: EventTypes | EventType; visible: boolean }) => {
      if (visible) {
        const visibleEvents: any =
          currentVisibleEvents === 'all'
            ? ALL_EVENT_TYPES.filter((eventType) => eventType !== event)
            : uniq([...(currentVisibleEvents === 'none' ? [] : currentVisibleEvents), event])
        replaceQueryParams({
          visibleEvents: visibleEvents?.length === ALL_EVENT_TYPES.length ? 'all' : visibleEvents,
        })
      } else {
        const currentVisibleEventsTypes =
          currentVisibleEvents === 'all'
            ? ALL_EVENT_TYPES
            : currentVisibleEvents === 'none'
              ? []
              : currentVisibleEvents
        const visibleEvents = currentVisibleEventsTypes.filter(
          (eventType) => event !== eventType
        ) as EventTypes[]
        replaceQueryParams({
          visibleEvents: visibleEvents?.length ? visibleEvents : 'none',
        })
      }
    },
    [currentVisibleEvents]
  )

  return useMemo(
    () => ({ visibleEvents: currentVisibleEvents, setVesselEventVisibility }),
    [currentVisibleEvents, setVesselEventVisibility]
  )
}
