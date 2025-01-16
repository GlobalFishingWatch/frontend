import { createSelector } from '@reduxjs/toolkit'
import type { VesselGroupInsightParams } from 'queries/vessel-insight-api'
import {
  selectVesselGroupInsight,
  selectVesselGroupInsightApiSlice,
} from 'queries/vessel-insight-api'
import type { RootState } from 'reducers'

import type { InsightType } from '@globalfishingwatch/api-types'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { dataviewHasVesselGroupId } from 'features/dataviews/dataviews.utils'
import {
  selectActiveVesselGroupDataviews,
  selectEventsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'

import {
  selectVGRActivitySubsection,
  selectVGREventsSubsection,
  selectVGRSubsection,
} from './vessel-group.config.selectors'
import type { VesselGroupEventsDataviewId } from './vessel-group-report.dataviews'
import {
  isVesselGroupActivityDataview,
  VESSEL_GROUP_EVENTS_DATAVIEW_IDS,
} from './vessel-group-report.dataviews'

export const COVERAGE_INSIGHT_ID = 'COVERAGE' as InsightType
export const GAP_INSIGHT_ID = 'GAP' as InsightType
export const FISHING_INSIGHT_ID = 'FISHING' as InsightType
export const IUU_INSIGHT_ID = 'VESSEL-IDENTITY-IUU-VESSEL-LIST' as InsightType
export const FLAG_CHANGE_INSIGHT_ID = 'VESSEL-IDENTITY-FLAG-CHANGES' as InsightType
export const MOU_INSIGHT_ID = 'VESSEL-IDENTITY-MOU-LIST' as InsightType

export const selectVGRDataviews = createSelector(
  [selectActiveVesselGroupDataviews, selectReportVesselGroupId],
  (dataviews, reportVesselGroupId) => {
    return dataviews?.filter((dataview) => dataviewHasVesselGroupId(dataview, reportVesselGroupId))
  }
)

export const selectVGRDataview = createSelector([selectVGRDataviews], (vesselGroupDataviews) => {
  return vesselGroupDataviews?.find((dataview) => !isVesselGroupActivityDataview(dataview.id))
})

export const selectVGRActivityDataview = createSelector(
  [selectVGRDataviews],
  (vesselGroupDataviews) => {
    return vesselGroupDataviews?.find((dataview) => isVesselGroupActivityDataview(dataview.id))
  }
)

export const selectVGREventsSubsectionDataview = createSelector(
  [
    selectEventsDataviews,
    selectVGRSubsection,
    selectVGRActivitySubsection,
    selectVGREventsSubsection,
  ],
  (dataviews, eventsSubsection) => {
    if (!dataviews?.length || !eventsSubsection) {
      return
    }
    return dataviews.find(
      ({ id }) =>
        id.includes(eventsSubsection) &&
        VESSEL_GROUP_EVENTS_DATAVIEW_IDS.includes(id as VesselGroupEventsDataviewId)
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

export const selectVGRInsightDataById = (
  selector: (state: RootState) => VesselGroupInsightParams
) => {
  return createSelector(
    [selectVesselGroupInsightApiSlice, selector],
    (vesselInsightApi, params) => {
      return selectVesselGroupInsight(params)({ vesselInsightApi })?.data
    }
  )
}

export const selectVGRGapInsightData = selectVGRInsightDataById(
  selectFetchVesselGroupReportGapParams
)
export const selectVGRCoverageInsightData = selectVGRInsightDataById(
  selectFetchVesselGroupReportCoverageParams
)
export const selectVGRFishingInsightData = selectVGRInsightDataById(
  selectFetchVesselGroupReportFishingParams
)
export const selectVGRIUUInsightData = selectVGRInsightDataById(
  selectFetchVesselGroupReportIUUParams
)
export const selectVGRFlagChangeInsightData = selectVGRInsightDataById(
  selectFetchVesselGroupReportFlagChangeParams
)
export const selectVGRMOUInsightData = selectVGRInsightDataById(
  selectFetchVesselGroupReportMOUParams
)
