import { createSelector } from '@reduxjs/toolkit'
import { getSearchIdentityResolved, getVesselId } from 'features/vessel/vessel.utils'
import {
  selectVesselGroupFishingInsightData,
  selectVesselGroupGapInsightData,
} from '../vessel-group-report.selectors'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'

export const selectVesselGroupReportGapVessels = createSelector(
  [selectVesselGroupGapInsightData, selectVesselGroupReportData],
  (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return
    }
    const insightVessels = vesselGroup?.vessels?.flatMap((vessel) => {
      const vesselWithInsight = data?.gap?.find((v) => v.vesselId === getVesselId(vessel))
      if (!vesselWithInsight) {
        return []
      }
      return { ...vesselWithInsight, identity: getSearchIdentityResolved(vessel) }
    })
    return insightVessels
  }
)

export const selectVesselGroupReportVesselsWithNoTakeMpas = createSelector(
  [selectVesselGroupFishingInsightData, selectVesselGroupReportData],
  (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return
    }
    const insightVessels = vesselGroup?.vessels?.flatMap((vessel) => {
      const vesselWithInsight = data?.apparentFishing?.find(
        (v) => v.vesselId === getVesselId(vessel)
      )
      if (!vesselWithInsight || vesselWithInsight.periodSelectedCounters.eventsInNoTakeMPAs === 0) {
        return []
      }
      return { ...vesselWithInsight, identity: getSearchIdentityResolved(vessel) }
    })
    return insightVessels
  }
)

export const selectVesselGroupReportVesselsInRfmoWithoutKnownAuthorization = createSelector(
  [selectVesselGroupFishingInsightData, selectVesselGroupReportData],
  (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return
    }
    const insightVessels = vesselGroup?.vessels?.flatMap((vessel) => {
      const vesselWithInsight = data?.apparentFishing?.find(
        (v) => v.vesselId === getVesselId(vessel)
      )
      if (
        !vesselWithInsight ||
        vesselWithInsight.periodSelectedCounters.eventsInRFMOWithoutKnownAuthorization === 0
      ) {
        return []
      }
      return { ...vesselWithInsight, identity: getSearchIdentityResolved(vessel) }
    })
    return insightVessels
  }
)
