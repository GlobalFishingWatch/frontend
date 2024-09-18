import { createSelector } from '@reduxjs/toolkit'
import {
  selectVesselGroupInsight,
  selectVesselGroupInsightApiSlice,
  VesselGroupInsightParams,
} from 'queries/vessel-insight-api'
import { RootState } from 'reducers'
import { InsightType } from '@globalfishingwatch/api-types'
import { selectActiveDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'

export const COVERAGE_INSIGHT_ID = 'COVERAGE' as InsightType
export const GAP_INSIGHT_ID = 'GAP' as InsightType
export const FISHING_INSIGHT_ID = 'FISHING' as InsightType
export const IUU_INSIGHT_ID = 'VESSEL-IDENTITY-IUU-VESSEL-LIST' as InsightType
export const FLAG_CHANGE_INSIGHT_ID = 'VESSEL-IDENTITY-FLAG-CHANGES' as InsightType
export const MOU_INSIGHT_ID = 'VESSEL-IDENTITY-MOU-LIST' as InsightType

export const selectVesselGroupReportDataview = createSelector(
  [selectActiveDataviewInstancesResolved, selectReportVesselGroupId],
  (dataviews, reportVesselGroupId) => {
    return dataviews?.find(({ config }) =>
      config?.filters?.['vessel-groups'].includes(reportVesselGroupId)
    )
  }
)

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

export const selectFetchVesselGroupReportParamsByInsight = (insight: InsightType) =>
  createSelector([selectBaseVesselGroupReportParams], (params) => {
    return { ...params, insight }
  })

export const selectFetchVesselGroupReportFishingParams =
  selectFetchVesselGroupReportParamsByInsight(FISHING_INSIGHT_ID)
export const selectFetchVesselGroupReportCoverageParams =
  selectFetchVesselGroupReportParamsByInsight(COVERAGE_INSIGHT_ID)
export const selectFetchVesselGroupReportGapParams =
  selectFetchVesselGroupReportParamsByInsight(GAP_INSIGHT_ID)
export const selectFetchVesselGroupReportIUUParams =
  selectFetchVesselGroupReportParamsByInsight(IUU_INSIGHT_ID)
export const selectFetchVesselGroupReportFlagChangeParams =
  selectFetchVesselGroupReportParamsByInsight(FLAG_CHANGE_INSIGHT_ID)
export const selectFetchVesselGroupReportMOUParams =
  selectFetchVesselGroupReportParamsByInsight(MOU_INSIGHT_ID)

export const selectVesselGroupGapInsightDataById = (
  selector: (state: RootState) => VesselGroupInsightParams
) => {
  return createSelector(
    [selectVesselGroupInsightApiSlice, selector],
    (vesselInsightApi, params) => {
      return selectVesselGroupInsight(params)({ vesselInsightApi })?.data
    }
  )
}

export const selectVesselGroupGapInsightData = selectVesselGroupGapInsightDataById(
  selectFetchVesselGroupReportGapParams
)
export const selectVesselGroupCoverageInsightData = selectVesselGroupGapInsightDataById(
  selectFetchVesselGroupReportCoverageParams
)
export const selectVesselGroupFishingInsightData = selectVesselGroupGapInsightDataById(
  selectFetchVesselGroupReportFishingParams
)
export const selectVesselGroupIUUInsightData = selectVesselGroupGapInsightDataById(
  selectFetchVesselGroupReportIUUParams
)
export const selectVesselGroupFlagChangeInsightData = selectVesselGroupGapInsightDataById(
  selectFetchVesselGroupReportFlagChangeParams
)
export const selectVesselGroupMOUInsightData = selectVesselGroupGapInsightDataById(
  selectFetchVesselGroupReportMOUParams
)
