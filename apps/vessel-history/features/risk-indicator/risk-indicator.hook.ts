import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { EventTypes } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectEventsInsideMPAByType } from 'features/risk/risk.selectors'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectEncountersInMPA,
  selectFishingInMPA,
  selectEncountersInForeignEEZ,
  selectCurrentMergedVesselsId,
} from './risk-indicator.selectors'
import { fetchIndicatorsByIdThunk, selectIndicatorsStatus } from './risk-indicator.slice'

export interface UseRiskIndicator {
  encountersInForeignEEZ: RenderedEvent[]
  encountersInMPA: RenderedEvent[]
  eventsLoading: boolean
  fishingInMPA: RenderedEvent[]
  loiteringInMPA: RenderedEvent[]
  countByRiskLevel: {
    medium: number
    high: number
  }
  indicatorsLoading: boolean
}

export function useRiskIndicator(): UseRiskIndicator {
  const dispatch = useAppDispatch()
  const idData = useSelector(selectCurrentMergedVesselsId)
  const indicatorsStatus = useSelector(selectIndicatorsStatus)
  const eventsLoading = useSelector(selectResourcesLoading)

  useEffect(() => {
    dispatch(fetchIndicatorsByIdThunk(idData))
  }, [dispatch, idData])

  const encountersInMPA = useSelector(selectEncountersInMPA)
  const fishingInMPA = useSelector(selectFishingInMPA)
  const encountersInForeignEEZ = useSelector(selectEncountersInForeignEEZ)

  /** Migration to API pengding */
  const loiteringInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Loitering))
  /******************************/

  return {
    encountersInForeignEEZ,
    encountersInMPA,
    eventsLoading,
    fishingInMPA,
    loiteringInMPA,
    countByRiskLevel: {
      medium:
        encountersInForeignEEZ.length +
        encountersInMPA.length +
        fishingInMPA.length +
        loiteringInMPA.length,
      high: 0,
    },
    indicatorsLoading: indicatorsStatus === AsyncReducerStatus.LoadingItem,
  }
}

export default useRiskIndicator
