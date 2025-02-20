import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import type { RootState } from 'reducers'

import type {
  InsightFishing,
  InsightGaps,
  InsightIdentity,
  InsightIdentityFlagsChanges,
  InsightIdentityIUU,
  InsightIdentityMOU,
  InsightValueInPeriod,
  VesselGroupInsight,
  VesselGroupInsightResponse,
} from '@globalfishingwatch/api-types'

import type { VesselLastIdentity } from 'features/search/search.slice'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { getVesselsWithoutDuplicates } from 'features/vessel-groups/vessel-groups.utils'

import {
  selectVGRFishingInsightData,
  selectVGRFlagChangeInsightData,
  selectVGRGapInsightData,
  selectVGRIUUInsightData,
  selectVGRMOUInsightData,
} from '../../report-vessel-group/vessel-group-report.selectors'
import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

export type VesselGroupReportInsightVessel<Insight = any> = VesselGroupInsight<Insight> & {
  identity: VesselLastIdentity
}

export const selectVGRVesselsByInsight = <Insight = any>(
  insightSelector: (state: RootState) => VesselGroupInsightResponse | undefined,
  insightProperty: keyof Omit<VesselGroupInsightResponse, 'period' | 'vesselIdsWithoutIdentity'>,
  insightCounter?: string
) => {
  return createSelector([insightSelector, selectVGRData], (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return []
    }
    const vesselsWithoutDuplicates = getVesselsWithoutDuplicates(vesselGroup.vessels)
    const insightVessels = vesselsWithoutDuplicates.flatMap((vessel) => {
      const vesselWithInsight = data?.[insightProperty]?.find((v) => v.vesselId === vessel.vesselId)
      if (!vesselWithInsight || (insightCounter && get(vesselWithInsight, insightCounter) === 0)) {
        return []
      }
      return { ...vesselWithInsight, identity: getSearchIdentityResolved(vessel.identity!) }
    })
    return insightVessels.sort((a, b) => {
      if (insightCounter) {
        const countA = get(a, insightCounter)
        const countB = get(b, insightCounter)
        if (countA === countB) return a.identity.shipname?.localeCompare(b.identity.shipname) || 0
        return countB - countA
      }
      return a.identity.shipname?.localeCompare(b.identity.shipname) || 0
    }) as VesselGroupReportInsightVessel<VesselGroupInsight<Insight>>[]
  })
}

export const selectVGRGapVessels = selectVGRVesselsByInsight<InsightGaps>(
  selectVGRGapInsightData,
  'gap',
  'periodSelectedCounters.eventsGapOff'
)

export const selectVGRVesselsWithNoTakeMpas = selectVGRVesselsByInsight<InsightFishing>(
  selectVGRFishingInsightData,
  'apparentFishing',
  'periodSelectedCounters.eventsInNoTakeMPAs'
)

export const selectVGRVesselsInRfmoWithoutKnownAuthorization =
  selectVGRVesselsByInsight<InsightFishing>(
    selectVGRFishingInsightData,
    'apparentFishing',
    'periodSelectedCounters.eventsInRFMOWithoutKnownAuthorization'
  )

export const selectVGRIUUVessels = selectVGRVesselsByInsight<InsightIdentity<InsightIdentityIUU>>(
  selectVGRIUUInsightData,
  'vesselIdentity',
  'iuuVesselList.totalTimesListedInThePeriod'
)

export const selectVGRFlagChangesVessels = selectVGRVesselsByInsight<
  InsightIdentity<InsightIdentityFlagsChanges>
>(selectVGRFlagChangeInsightData, 'vesselIdentity', 'flagsChanges.totalTimesListedInThePeriod')

export const selectVGRMOUVessels = selectVGRVesselsByInsight<InsightIdentity<InsightIdentityMOU>>(
  selectVGRMOUInsightData,
  'vesselIdentity'
)

export type MouVesselByCategoryInsight = {
  vessel: VesselLastIdentity
  insight: InsightValueInPeriod
}

export type MOUInsightCountry = 'paris' | 'tokyo'
export type MOUInsightList = 'black' | 'grey'
export type MOUVesselByList = Record<MOUInsightList, MouVesselByCategoryInsight[]>
export type MOUVesselsGrouped = Record<MOUInsightCountry, MOUVesselByList>
export const selectVGRMOUVesselsGrouped = createSelector([selectVGRMOUVessels], (vessels) => {
  return vessels?.reduce(
    (acc, vessel) => {
      if (
        vessel.mouList?.tokyo?.totalTimesListedInThePeriod &&
        vessel.mouList?.tokyo?.totalTimesListedInThePeriod > 0
      ) {
        vessel.mouList.tokyo.valuesInThePeriod.forEach((value) => {
          acc.tokyo[value.value.toLowerCase() as keyof MOUVesselByList]?.push({
            vessel: vessel.identity,
            insight: value,
          })
        })
      }
      if (
        vessel.mouList?.paris?.totalTimesListedInThePeriod &&
        vessel.mouList?.paris?.totalTimesListedInThePeriod > 0
      ) {
        vessel.mouList.paris.valuesInThePeriod.forEach((value) => {
          acc.paris[value.value.toLowerCase() as keyof MOUVesselByList]?.push({
            vessel: vessel.identity,
            insight: value,
          })
        })
      }
      return acc
    },
    { tokyo: { black: [], grey: [] }, paris: { black: [], grey: [] } } as MOUVesselsGrouped
  )
})
