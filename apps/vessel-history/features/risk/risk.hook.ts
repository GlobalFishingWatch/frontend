import { useSelector } from 'react-redux'
import { EventTypes } from '@globalfishingwatch/api-types'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectEncountersInForeignEEZ, selectEventsInsideMPAByType } from './risk.selectors'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseRisk {
  encountersInForeignEEZ: RenderedEvent[]
  encountersInMPA: RenderedEvent[]
  eventsLoading: boolean
  fishingInMPA: RenderedEvent[]
  loiteringInMPA: RenderedEvent[]
}

export function useRisk(): UseRisk {
  const encountersInForeignEEZ = useSelector(selectEncountersInForeignEEZ)
  const encountersInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Encounter))
  const fishingInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Fishing))
  const loiteringInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Loitering))
  const eventsLoading = useSelector(selectResourcesLoading)

  return { encountersInForeignEEZ, encountersInMPA, eventsLoading, fishingInMPA, loiteringInMPA }
}

export default useRisk
