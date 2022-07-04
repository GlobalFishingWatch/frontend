import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { EventTypes } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import {
  selectEncountersInForeignEEZ,
  selectEventsInsideMPAByType,
} from 'features/risk/risk.selectors'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectUrlAkaVesselQuery, selectVesselProfileId } from 'routes/routes.selectors'
import { Indicator } from 'types/risk-indicator'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectEncountersInMPA, selectFishingInMPA } from './risk-indicator.selectors'
import {
  fetchIndicatorsByIdThunk,
  getMergedVesselsUniqueId,
  selectIndicatorById,
  selectIndicatorsStatus,
} from './risk-indicator.slice'

export interface UseRiskIndicator extends Indicator {
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
  const vesselProfileId = useSelector(selectVesselProfileId)
  const akaVesselProfileIds = useSelector(selectUrlAkaVesselQuery)
  const idData = [vesselProfileId, ...akaVesselProfileIds].map((vesselProfileId) => {
    const [datasetId, vesselId, tmtId] = vesselProfileId.split('_')
    return { datasetId, vesselId, tmtId }
  })
  const mergedVesselsId = getMergedVesselsUniqueId(idData)
  const vesselIndicators = useSelector(selectIndicatorById(mergedVesselsId))
  const indicatorsStatus = useSelector(selectIndicatorsStatus)
  const eventsLoading = useSelector(selectResourcesLoading)

  useEffect(() => {
    dispatch(fetchIndicatorsByIdThunk(idData))
  }, [dispatch, idData])

  const encountersInMPA = useSelector(selectEncountersInMPA)
  const fishingInMPA = useSelector(selectFishingInMPA)

  /** Migration to API pengding */
  const encountersInForeignEEZ = useSelector(selectEncountersInForeignEEZ)
  const loiteringInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Loitering))
  /******************************/

  return {
    ...vesselIndicators,
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
