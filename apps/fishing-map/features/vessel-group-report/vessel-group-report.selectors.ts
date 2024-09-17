import { createSelector } from '@reduxjs/toolkit'
import {
  selectVesselGroupInsight,
  selectVesselGroupInsightApiSlice,
} from 'queries/vessel-insight-api'
import { InsightType } from '@globalfishingwatch/api-types'
import { selectActiveDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'

export const COVERAGE_INSIGHT_ID = 'COVERAGE' as InsightType
export const GAP_INSIGHT_ID = 'GAP' as InsightType
export const FISHING_INSIGHT_ID = 'FISHING' as InsightType

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

export const selectFetchVesselGroupReportCoverageParams = createSelector(
  [selectBaseVesselGroupReportParams],
  (params) => {
    return { ...params, insight: COVERAGE_INSIGHT_ID }
  }
)

export const selectFetchVesselGroupReportGapParams = createSelector(
  [selectBaseVesselGroupReportParams],
  (params) => {
    return { ...params, insight: GAP_INSIGHT_ID }
  }
)

export const selectFetchVesselGroupReportFishingParams = createSelector(
  [selectBaseVesselGroupReportParams],
  (params) => {
    return { ...params, insight: FISHING_INSIGHT_ID }
  }
)

export const selectVesselGroupGapInsightData = createSelector(
  [selectVesselGroupInsightApiSlice, selectFetchVesselGroupReportGapParams],
  (vesselInsightApi, params) => {
    return selectVesselGroupInsight(params)({ vesselInsightApi })?.data
  }
)

export const selectVesselGroupFishingInsightData = createSelector(
  [selectVesselGroupInsightApiSlice, selectFetchVesselGroupReportFishingParams],
  (vesselInsightApi, params) => {
    return selectVesselGroupInsight(params)({ vesselInsightApi })?.data
  }
)
