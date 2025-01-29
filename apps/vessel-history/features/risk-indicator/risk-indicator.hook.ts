import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { ValueItem, VesselWithHistory } from 'types'

import { EventTypes } from '@globalfishingwatch/api-types'

import { IS_STANDALONE_APP } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectEventsInsideMPAByType } from 'features/risk/risk.selectors'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { getUniqueHistoryValues } from 'features/vessels/activity/vessels-activity.utils'
import { selectVesselById } from 'features/vessels/vessels.slice'
import { selectMergedVesselId } from 'routes/routes.selectors'
import type { AISCoverage, FlagOnMOU } from 'types/risk-indicator'
import { IndicatorType } from 'types/risk-indicator'
import { AsyncReducerStatus } from 'utils/async-slice'

import {
  selectCoverage,
  selectCurrentMergedVesselsId,
  selectCurrentMergedVesselsIndicators,
  selectEncountersInForeignEEZ,
  selectEncountersInMPA,
  selectEncountersInRFMOWithoutAuthorization,
  selectEncountersRFMOsAreasWithoutAuthorization,
  selectFishingInMPA,
  selectFishingInRFMOWithoutAuthorization,
  selectFishingRFMOsAreasWithoutAuthorization,
  selectGapsIntentionalDisabling,
  selectPortVisitsToNonPSMAPortState,
  selectRiskVesselIndentityFlagsHistory,
  selectRiskVesselIndentityNamesHistory,
  selectRiskVesselIndentityOperatorsHistory,
  selectRiskVesselIndentityOwnersHistory,
  selectVesselIdentityMouIndicators,
} from './risk-indicator.selectors'
import {
  fetchIndicatorsByIdThunk,
  selectIndicatorsRequests,
  selectIndicatorsStatus,
} from './risk-indicator.slice'

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
  gapsIntentionalDisabling: RenderedEvent[]
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

export function useRiskIndicator(showIdentityIndicators: boolean): UseRiskIndicator {
  const dispatch = useAppDispatch()
  const idData = useSelector(selectCurrentMergedVesselsId)
  const indicatorsStatus = useSelector(selectIndicatorsStatus)
  const indicatorsRequest = useSelector(selectIndicatorsRequests)
  const eventsLoading = useSelector(selectResourcesLoading)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const vessel = useSelector(selectVesselById(mergedVesselId))
  const indicatorsKeys = useMemo(
    () => [
      IndicatorType.encounter,
      IndicatorType.fishing,
      IndicatorType.portVisit,
      IndicatorType.gap,
      IndicatorType.vesselIdentity,
      IndicatorType.coverage,
    ],
    []
  )
  // deprecated
  // useEffect(() => {
  //   if (!IS_STANDALONE_APP) {
  //     // Avoid multiple requests without permission
  //     indicatorsKeys.forEach((indicator) =>
  //       dispatch(fetchIndicatorsByIdThunk({ idData, indicator }))
  //     )
  //   }
  // }, [dispatch, idData, indicatorsKeys])

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
  const gapsIntentionalDisabling = useSelector(selectGapsIntentionalDisabling)

  const uniqueFlags = useMemo(() => getUniqueHistoryValues(flagsHistory), [flagsHistory])
  const uniqueNames = useMemo(() => getUniqueHistoryValues(namesHistory), [namesHistory])
  const uniqueOperators = useMemo(
    () => getUniqueHistoryValues(operatorsHistory),
    [operatorsHistory]
  )
  const uniqueOwners = useMemo(() => getUniqueHistoryValues(ownersHistory), [ownersHistory])

  const mergedIndicators = useSelector(selectCurrentMergedVesselsIndicators)

  const iuuBlacklisted = useMemo(
    () => mergedIndicators?.vesselIdentity?.iuuListed,
    [mergedIndicators]
  )

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
        (showIdentityIndicators
          ? Math.max(0, uniqueOperators.length - 1) +
            Math.max(0, uniqueOwners.length - 1) +
            Math.max(0, uniqueNames.length - 1)
          : 0) +
        // Port visits have also two sub events (entry and exit)
        portVisitsToNonPSMAPortState.length / 3 +
        vesselFlagsOnMOU.length +
        (gapsIntentionalDisabling?.length ?? 0) +
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
    gapsIntentionalDisabling,
    indicatorsLoading:
      indicatorsStatus === AsyncReducerStatus.LoadingItem &&
      indicatorsRequest.length === indicatorsKeys.length,
    iuuBlacklisted,
    loiteringInMPA,
    namesHistory,
    operatorsHistory,
    ownersHistory,
    portVisitsToNonPSMAPortState,
    uniqueFlags,
    uniqueNames: showIdentityIndicators ? uniqueNames : [],
    uniqueOperators: showIdentityIndicators ? uniqueOperators : [],
    uniqueOwners: showIdentityIndicators ? uniqueOwners : [],
    vessel,
    vesselFlagsOnMOU,
  }
}

export default useRiskIndicator
