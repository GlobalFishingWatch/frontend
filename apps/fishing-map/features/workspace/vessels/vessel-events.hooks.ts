import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { EventType } from '@globalfishingwatch/api-types'

import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'

const ALL_EVENT_TYPES: EventType[] = ['fishing', 'loitering', 'encounter', 'port_visit']

export const useVisibleVesselEvents = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const currentVisibleEvents = useSelector(selectVisibleEvents)

  const setVesselEventVisibility = useCallback(
    ({ event, visible }: { event: EventType; visible: boolean }) => {
      if (visible) {
        const visibleEvents: any =
          currentVisibleEvents === 'all'
            ? ALL_EVENT_TYPES.filter((eventType) => eventType !== event)
            : [...(currentVisibleEvents === 'none' ? [] : currentVisibleEvents), event]
        dispatchQueryParams({
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
        ) as EventType[]
        dispatchQueryParams({
          visibleEvents: visibleEvents?.length ? visibleEvents : 'none',
        })
      }
    },
    [dispatchQueryParams, currentVisibleEvents]
  )

  return useMemo(
    () => ({ visibleEvents: currentVisibleEvents, setVesselEventVisibility }),
    [currentVisibleEvents, setVesselEventVisibility]
  )
}
