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
import { VGRSubsection } from 'features/vessel-groups/vessel-groups.types'
import { dataviewHasVesselGroupId } from 'features/dataviews/dataviews.utils'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import {
  selectVGRActivitySubsection,
  selectVGREventsSubsection,
  selectVGRSection,
  selectVGRVesselsSubsection,
} from './vessel-group.config.selectors'
import {
  VESSEL_GROUP_EVENTS_DATAVIEW_IDS,
  VesselGroupEventsDataviewId,
} from './vessel-group-report.dataviews'

export const COVERAGE_INSIGHT_ID = 'COVERAGE' as InsightType
export const GAP_INSIGHT_ID = 'GAP' as InsightType
export const FISHING_INSIGHT_ID = 'FISHING' as InsightType
export const IUU_INSIGHT_ID = 'VESSEL-IDENTITY-IUU-VESSEL-LIST' as InsightType
export const FLAG_CHANGE_INSIGHT_ID = 'VESSEL-IDENTITY-FLAG-CHANGES' as InsightType
export const MOU_INSIGHT_ID = 'VESSEL-IDENTITY-MOU-LIST' as InsightType

export const selectVGRDataview = createSelector(
  [selectActiveDataviewInstancesResolved, selectReportVesselGroupId],
  (dataviews, reportVesselGroupId) => {
    return dataviews?.find((dataview) => dataviewHasVesselGroupId(dataview, reportVesselGroupId))
  }
)

export const selectVGRSubsection = createSelector(
  [
    selectVGRSection,
    selectVGRVesselsSubsection,
    selectVGRActivitySubsection,
    selectVGREventsSubsection,
  ],
  (section, vesselsSubsection, activitySubsection, eventsSubsection): VGRSubsection | undefined => {
    if (section === 'activity') {
      return activitySubsection
    }
    if (section === 'events') {
      return eventsSubsection
    }
    if (section === 'vessels') {
      return vesselsSubsection
    }
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
