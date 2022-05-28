import { useSelector } from 'react-redux'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { EventTypes } from '../../../../libs/api-types/src/events'
import { selectEventsInsideMPAByType } from './risk.selectors'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseRisk {
  encountersInMPA: RenderedEvent[]
  fishingInMPA: RenderedEvent[]
  loiteringInMPA: RenderedEvent[]
}

export function useRisk(): UseRisk {
  const encountersInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Encounter))
  const fishingInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Fishing))
  const loiteringInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Loitering))

  return { encountersInMPA, fishingInMPA, loiteringInMPA }
}

export default useRisk
