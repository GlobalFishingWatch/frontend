import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import {
  type ActivityEvent,
  selectEventsGroupedByVoyages,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselActivityMode } from 'features/vessel/vessel.config.selectors'
import {
  selectVesselEventType,
  selectVesselVoyage,
  setVesselEventId,
  setVesselEventType,
  setVesselVoyage,
} from 'features/vessel/vessel.slice'

export const useEventActivityToggle = () => {
  const dispatch = useAppDispatch()
  const activityMode = useSelector(selectVesselActivityMode)
  const vesselEventType = useSelector(selectVesselEventType)
  const expandedVoyage = useSelector(selectVesselVoyage)
  const eventsGroupedByVoyages = useSelector(selectEventsGroupedByVoyages)

  const setEventGroup = useCallback(
    (event: ActivityEvent | null) => {
      if (activityMode === 'voyage') {
        let voyage = event
          ? event.voyage ||
            Object.values(eventsGroupedByVoyages).findIndex((events) =>
              events.some((e) => e.id === event.id)
            ) + 1
          : null
        if (voyage === 0) {
          voyage = null
        }
        dispatch(setVesselVoyage(voyage))
        dispatch(setVesselEventId(null))
        return voyage
      } else {
        const eventType = event ? event.type : null
        dispatch(setVesselEventType(eventType))
        dispatch(setVesselEventId(null))
        return eventType
      }
    },
    [activityMode, dispatch, eventsGroupedByVoyages]
  )

  return useMemo(() => {
    return [activityMode === 'voyage' ? expandedVoyage : vesselEventType, setEventGroup] as const
  }, [activityMode, expandedVoyage, setEventGroup, vesselEventType])
}
