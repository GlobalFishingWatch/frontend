import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { EventTypes } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectEventsInsideMPAByType } from 'features/risk/risk.selectors'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { AISCoverage, FlagOnMOU } from 'types/risk-indicator'
import { selectMergedVesselId } from 'routes/routes.selectors'
import { selectVesselById } from 'features/vessels/vessels.slice'
import { ValueItem, VesselWithHistory } from 'types'
import { getUniqueHistoryValues } from 'features/vessels/activity/vessels-activity.utils'
import { fetchIndicatorsByIdThunk, selectIndicatorsStatus } from './risk-indicator.slice'
import {
  selectEncountersInMPA,
  selectFishingInMPA,
  selectEncountersInForeignEEZ,
  selectCurrentMergedVesselsId,
  selectPortVisitsToNonPSMAPortState,
  selectVesselIdentityMouIndicators,
  selectRiskVesselIndentityFlagsHistory,
  selectEncountersInRFMOWithoutAuthorization,
  selectEncountersRFMOsAreasWithoutAuthorization,
  selectFishingInRFMOWithoutAuthorization,
  selectFishingRFMOsAreasWithoutAuthorization,
  selectRiskVesselIndentityNamesHistory,
  selectRiskVesselIndentityOwnersHistory,
  selectCurrentMergedVesselsIndicators,
  selectRiskVesselIndentityOperatorsHistory,
  selectCoverage,
} from './risk-indicator.selectors'

export interface UseRiskIndicator {
  coverage: AISCoverage
  encountersInForeignEEZ: RenderedEvent[]
  encountersInMPA: RenderedEvent[]
  encountersInRFMOWithoutAuthorization: RenderedEvent[]
  encountersRFMOsAreasWithoutAuthorization: string[]
  eventsLoading: boolean
  fishingInMPA: RenderedEvent[]
  fishingInRFMOWithoutAuthorization: RenderedEvent[]
  fishingRFMOsAreasWithoutAuthorization: string[]
  loiteringInMPA: RenderedEvent[]
  portVisitsToNonPSMAPortState: RenderedEvent[]
  countByRiskLevel: {
    medium: number
    high: number
  }
  indicatorsLoading: boolean
  iuuBlacklisted: boolean
  vesselFlagsOnMOU: FlagOnMOU[]
  vessel: VesselWithHistory
  flagsHistory: ValueItem[]
  namesHistory: ValueItem[]
  operatorsHistory: ValueItem[]
  ownersHistory: ValueItem[]
  uniqueFlags: string[]
  uniqueNames: string[]
  uniqueOperators: string[]
  uniqueOwners: string[]
}

export function useRiskIndicator(): UseRiskIndicator {
  const dispatch = useAppDispatch()
  const idData = useSelector(selectCurrentMergedVesselsId)
  const indicatorsStatus = useSelector(selectIndicatorsStatus)
  const eventsLoading = useSelector(selectResourcesLoading)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const vessel = useSelector(selectVesselById(mergedVesselId))

  useEffect(() => {
    dispatch(fetchIndicatorsByIdThunk(idData))
  }, [dispatch, idData])

  const encountersInMPA = useSelector(selectEncountersInMPA)
  const fishingInMPA = useSelector(selectFishingInMPA)
  const encountersInForeignEEZ = useSelector(selectEncountersInForeignEEZ)
  const coverage = useSelector(selectCoverage)
  const portVisitsToNonPSMAPortState = useSelector(selectPortVisitsToNonPSMAPortState)
  const vesselFlagsOnMOU = useSelector(selectVesselIdentityMouIndicators)
  const flagsHistory = useSelector(selectRiskVesselIndentityFlagsHistory)
  const namesHistory = useSelector(selectRiskVesselIndentityNamesHistory)
  const operatorsHistory = useSelector(selectRiskVesselIndentityOperatorsHistory)
  const ownersHistory = useSelector(selectRiskVesselIndentityOwnersHistory)
  const encountersInRFMOWithoutAuthorization = useSelector(
    selectEncountersInRFMOWithoutAuthorization
  )
  const encountersRFMOsAreasWithoutAuthorization = useSelector(
    selectEncountersRFMOsAreasWithoutAuthorization
  )
  const fishingInRFMOWithoutAuthorization = useSelector(selectFishingInRFMOWithoutAuthorization)
  const fishingRFMOsAreasWithoutAuthorization = useSelector(
    selectFishingRFMOsAreasWithoutAuthorization
  )

  const uniqueFlags = useMemo(() => getUniqueHistoryValues(flagsHistory), [flagsHistory])
  const uniqueNames = useMemo(() => getUniqueHistoryValues(namesHistory), [namesHistory])
  const uniqueOperators = useMemo(
    () => getUniqueHistoryValues(operatorsHistory),
    [operatorsHistory]
  )
  const uniqueOwners = useMemo(() => getUniqueHistoryValues(ownersHistory), [ownersHistory])
  const {
    vesselIdentity: { iuuListed: iuuBlacklisted },
  } = useSelector(selectCurrentMergedVesselsIndicators) ?? { vesselIdentity: { iuuListed: null } }

  /** Migration to API pengding */
  const loiteringInMPA = useSelector(selectEventsInsideMPAByType(EventTypes.Loitering))
  /******************************/

  return {
    countByRiskLevel: {
      medium:
        encountersInForeignEEZ.length +
        encountersInMPA.length +
        encountersInRFMOWithoutAuthorization.length +
        fishingInMPA.length +
        fishingInRFMOWithoutAuthorization.length +
        loiteringInMPA.length +
        Math.max(0, uniqueFlags.length - 1) +
        Math.max(0, uniqueOperators.length - 1) +
        Math.max(0, uniqueOwners.length - 1) +
        portVisitsToNonPSMAPortState.length +
        vesselFlagsOnMOU.length +
        0,
      high: (iuuBlacklisted ? 1 : 0) + 0,
    },
    coverage,
    encountersInForeignEEZ,
    encountersInMPA,
    encountersInRFMOWithoutAuthorization,
    encountersRFMOsAreasWithoutAuthorization,
    eventsLoading,
    fishingInMPA,
    fishingInRFMOWithoutAuthorization,
    fishingRFMOsAreasWithoutAuthorization,
    flagsHistory,
    indicatorsLoading: indicatorsStatus === AsyncReducerStatus.LoadingItem,
    iuuBlacklisted,
    loiteringInMPA,
    namesHistory,
    operatorsHistory,
    ownersHistory,
    portVisitsToNonPSMAPortState,
    uniqueFlags,
    uniqueNames,
    uniqueOperators,
    uniqueOwners,
    vessel,
    vesselFlagsOnMOU,
  }
}

export default useRiskIndicator
