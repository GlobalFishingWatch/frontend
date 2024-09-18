import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import { RootState } from 'reducers'
import {
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
import { getSearchIdentityResolved, getVesselId } from 'features/vessel/vessel.utils'
import { VesselLastIdentity } from 'features/search/search.slice'
import {
  selectVesselGroupFishingInsightData,
  selectVesselGroupFlagChangeInsightData,
  selectVesselGroupGapInsightData,
  selectVesselGroupIUUInsightData,
  selectVesselGroupMOUInsightData,
} from '../vessel-group-report.selectors'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'

export type VesselGroupReportInsightVessel<Insight = any> = VesselGroupInsight<Insight> & {
  identity: VesselLastIdentity
}

export const selectVesselGroupReportVesselsByInsight = <Insight = any>(
  insightSelector: (state: RootState) => VesselGroupInsightResponse | undefined,
  insightProperty: keyof Omit<VesselGroupInsightResponse, 'period' | 'vesselIdsWithoutIdentity'>,
  insightCounter?: string
) => {
  return createSelector([insightSelector, selectVesselGroupReportData], (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return []
    }
    const insightVessels = vesselGroup?.vessels?.flatMap((vessel) => {
      const vesselWithInsight = data?.[insightProperty]?.find(
        (v) => v.vesselId === getVesselId(vessel)
      )
      if (!vesselWithInsight || (insightCounter && get(vesselWithInsight, insightCounter) === 0)) {
        return []
      }
      return { ...vesselWithInsight, identity: getSearchIdentityResolved(vessel) }
    })
    return insightVessels as VesselGroupReportInsightVessel<VesselGroupInsight<Insight>>[]
  })
}

export const selectVesselGroupReportGapVessels =
  selectVesselGroupReportVesselsByInsight<InsightGaps>(selectVesselGroupGapInsightData, 'gap')

export const selectVesselGroupReportVesselsWithNoTakeMpas =
  selectVesselGroupReportVesselsByInsight<InsightFishing>(
    selectVesselGroupFishingInsightData,
    'apparentFishing',
    'periodSelectedCounters.eventsInNoTakeMPAs'
  )

export const selectVesselGroupReportVesselsInRfmoWithoutKnownAuthorization =
  selectVesselGroupReportVesselsByInsight<InsightFishing>(
    selectVesselGroupFishingInsightData,
    'apparentFishing',
    'periodSelectedCounters.eventsInRFMOWithoutKnownAuthorization'
  )

export const selectVesselGroupReportIUUVessels = selectVesselGroupReportVesselsByInsight<
  InsightIdentity<InsightIdentityIUU>
>(selectVesselGroupIUUInsightData, 'vesselIdentity', 'iuuVesselList.totalTimesListedInThePeriod')

export const selectVesselGroupReportFlagChangesVessels = selectVesselGroupReportVesselsByInsight<
  InsightIdentity<InsightIdentityFlagsChanges>
>(
  selectVesselGroupFlagChangeInsightData,
  'vesselIdentity',
  'flagsChanges.totalTimesListedInThePeriod'
)

export const selectVesselGroupReportMOUVessels = selectVesselGroupReportVesselsByInsight<
  InsightIdentity<InsightIdentityMOU>
>(selectVesselGroupMOUInsightData, 'vesselIdentity')

export type MouVesselByCategoryInsight = {
  vessel: VesselLastIdentity
  insight: InsightValueInPeriod
}

export type MOUInsightCountry = 'paris' | 'tokyo'
export type MOUInsightList = 'black' | 'grey'
export type MOUVesselByList = Record<MOUInsightList, MouVesselByCategoryInsight[]>
export type MOUVesselsGrouped = Record<MOUInsightCountry, MOUVesselByList>
export const selectVesselGroupReportMOUVesselsGrouped = createSelector(
  [selectVesselGroupReportMOUVessels],
  (vessels) => {
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
  }
)
