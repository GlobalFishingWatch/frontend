import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import type { EventType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'

import { selectVisibleEvents } from 'features/_map/workspace/selectors/app.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { VisibleEvents } from 'types'

const ALL_EVENT_TYPES = [
  EventTypes.Fishing,
  EventTypes.Loitering,
  EventTypes.Encounter,
  EventTypes.Port,
  EventTypes.Gaps,
]

export const isVesselEventVisible = (
  visibleEvents: VisibleEvents,
  eventType: EventTypes | EventType
) => {
  if (visibleEvents === 'all') return true
  if (visibleEvents === 'none') return false
  return visibleEvents.includes(eventType)
}

export const useVisibleVesselEvents = () => {
  const currentVisibleEvents = useSelector(selectVisibleEvents)
  const { replaceQueryParams } = useReplaceQueryParams()

  const setVesselEventVisibility = useCallback(
    ({ event, visible }: { event: EventTypes | EventType; visible: boolean }) => {
      const currentVisibleEventsTypes =
        currentVisibleEvents === 'all'
          ? ALL_EVENT_TYPES
          : currentVisibleEvents === 'none'
            ? []
            : (currentVisibleEvents as EventTypes[])
      if (visible) {
        const visibleEvents = uniq([...currentVisibleEventsTypes, event as EventTypes])
        replaceQueryParams({
          visibleEvents: visibleEvents.length === ALL_EVENT_TYPES.length ? 'all' : visibleEvents,
        })
      } else {
        const visibleEvents = currentVisibleEventsTypes.filter((eventType) => event !== eventType)
        replaceQueryParams({
          visibleEvents: visibleEvents.length ? visibleEvents : 'none',
        })
      }
    },
    [currentVisibleEvents, replaceQueryParams]
  )

  return useMemo(
    () => ({ visibleEvents: currentVisibleEvents, setVesselEventVisibility }),
    [currentVisibleEvents, setVesselEventVisibility]
  )
}
