import { createSelector } from '@reduxjs/toolkit'
import type { VesselGroupInsightParams } from 'queries/vessel-insight-api'
import {
  selectVesselGroupInsight,
  selectVesselGroupInsightApiSlice,
} from 'queries/vessel-insight-api'
import type { RootState } from 'reducers'

import type { InsightType } from '@globalfishingwatch/api-types'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVGRData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'

export const COVERAGE_INSIGHT_ID = 'COVERAGE' as InsightType
export const GAP_INSIGHT_ID = 'GAP' as InsightType
export const FISHING_INSIGHT_ID = 'FISHING' as InsightType
export const IUU_INSIGHT_ID = 'VESSEL-IDENTITY-IUU-VESSEL-LIST' as InsightType
export const FLAG_CHANGE_INSIGHT_ID = 'VESSEL-IDENTITY-FLAG-CHANGES' as InsightType
export const MOU_INSIGHT_ID = 'VESSEL-IDENTITY-MOU-LIST' as InsightType

export const selectBaseVesselGroupReportParams = createSelector(
  [selectTimeRange, selectReportVesselGroupId],
  ({ start, end }, reportVesselGroupId) => {
    return {
      vesselGroupId: reportVesselGroupId,
      start,
      end,
    }
  }
)

export const selectFetchVGRParamsByInsight = (insight: InsightType) =>
  createSelector([selectBaseVesselGroupReportParams], (params) => {
    return { ...params, insight }
  })

export const selectFetchVesselGroupReportFishingParams =
  selectFetchVGRParamsByInsight(FISHING_INSIGHT_ID)
export const selectFetchVesselGroupReportCoverageParams =
  selectFetchVGRParamsByInsight(COVERAGE_INSIGHT_ID)
export const selectFetchVesselGroupReportGapParams = selectFetchVGRParamsByInsight(GAP_INSIGHT_ID)
export const selectFetchVesselGroupReportIUUParams = selectFetchVGRParamsByInsight(IUU_INSIGHT_ID)
export const selectFetchVesselGroupReportFlagChangeParams =
  selectFetchVGRParamsByInsight(FLAG_CHANGE_INSIGHT_ID)
export const selectFetchVesselGroupReportMOUParams = selectFetchVGRParamsByInsight(MOU_INSIGHT_ID)

export const selectVGRInsightById = (selector: (state: RootState) => VesselGroupInsightParams) => {
  return createSelector(
    [selectVesselGroupInsightApiSlice, selector],
    (vesselInsightApi, params) => {
      return selectVesselGroupInsight(params)({ vesselInsightApi })
    }
  )
}

export const selectVGRGapInsight = selectVGRInsightById(selectFetchVesselGroupReportGapParams)

export const selectVGRGapInsightData = createSelector([selectVGRGapInsight], (gapInsight) => {
  return gapInsight?.data
})

export const selectVGRCoverageInsight = selectVGRInsightById(
  selectFetchVesselGroupReportCoverageParams
)

export const selectVGRCoverageInsightData = createSelector(
  [selectVGRCoverageInsight],
  (coverageInsight) => {
    return coverageInsight?.data
  }
)
export const selectVGRFishingInsight = selectVGRInsightById(
  selectFetchVesselGroupReportFishingParams
)
export const selectVGRFishingInsightData = createSelector(
  [selectVGRFishingInsight],
  (fishingInsight) => {
    return fishingInsight?.data
  }
)
export const selectVGRIUUInsight = selectVGRInsightById(selectFetchVesselGroupReportFishingParams)
export const selectVGRIUUInsightData = createSelector([selectVGRIUUInsight], (iuuInsight) => {
  return iuuInsight?.data
})
export const selectVGRFlagChangeInsight = selectVGRInsightById(
  selectFetchVesselGroupReportFlagChangeParams
)
export const selectVGRFlagChangeInsightData = createSelector(
  [selectVGRFlagChangeInsight],
  (flagChangeInsight) => {
    return flagChangeInsight?.data
  }
)
export const selectVGRMOUInsight = selectVGRInsightById(
  selectFetchVesselGroupReportFlagChangeParams
)
export const selectVGRMOUInsightData = createSelector([selectVGRMOUInsight], (mouInsight) => {
  return mouInsight?.data
})

export const selectUserIsVesselGroupOwner = createSelector(
  [selectUserData, selectVGRData],
  (userData, vesselGroup) => {
    return userData?.id === vesselGroup?.ownerId
  }
)
