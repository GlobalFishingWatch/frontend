import { createSelector } from '@reduxjs/toolkit'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { getDatasetsExtent } from '@globalfishingwatch/datasets-client'

import { AVAILABLE_END, AVAILABLE_START } from 'data/config'
import {
  selectActivityVisualizationMode,
  selectDetectionsVisualizationMode,
} from 'features/app/selectors/app.selectors'
import {
  selectTimebarSelectedEnvId,
  selectTimebarSelectedVGId,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveVesselGroupDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/dataviews/selectors/dataviews.selectors'
import { getReportCategoryFromDataview } from 'features/reports/report-area/area-reports.utils'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { selectIsAnyAreaReportLocation } from 'routes/routes.selectors'
import { TimebarVisualisations } from 'types'
import { getUTCDateTime } from 'utils/dates'

export const selectActiveActivityDataviewsByVisualisation = (
  timebarVisualisation: TimebarVisualisations
) =>
  createSelector(
    [
      selectActiveActivityDataviews,
      selectActiveDetectionsDataviews,
      selectActiveHeatmapEnvironmentalDataviewsWithoutStatic,
      selectActiveVesselGroupDataviews,
      selectTimebarSelectedEnvId,
      selectTimebarSelectedVGId,
    ],
    (
      activityDataviews,
      detectionsDataviews,
      environmentDataviews,
      vesselGroupDataviews,
      timebarSelectedEnvId,
      timebarSelectedVGId
    ) => {
      if (timebarVisualisation === TimebarVisualisations.HeatmapActivity) {
        return activityDataviews
      }
      if (timebarVisualisation === TimebarVisualisations.HeatmapDetections) {
        return detectionsDataviews
      }
      if (timebarVisualisation === TimebarVisualisations.VesselGroup) {
        const selectedVGDataview =
          timebarSelectedVGId && vesselGroupDataviews.find((d) => d.id === timebarSelectedVGId)

        if (selectedVGDataview) return [selectedVGDataview]
        else if (vesselGroupDataviews[0]) return [vesselGroupDataviews[0]]
      }
      // timebarVisualisation === TimebarVisualisations.Environment
      const selectedEnvDataview =
        timebarSelectedEnvId && environmentDataviews.find((d) => d.id === timebarSelectedEnvId)

      if (selectedEnvDataview) return [selectedEnvDataview]
      else if (environmentDataviews[0]) return [environmentDataviews[0]]
    }
  )

const selectActiveDatasets = createSelector(
  [selectDataviewInstancesResolved, selectAllDatasets],
  (dataviews, datasets) => {
    const activeDataviewDatasets = getDatasetsInDataviews(dataviews)
    return datasets.filter((d) => activeDataviewDatasets.includes(d.id))
  }
)

const selectDatasetsExtent = createSelector([selectActiveDatasets], (activeDatasets) => {
  return getDatasetsExtent<number>(activeDatasets, {
    format: 'timestamp',
  })
})

export const selectAvailableStart = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableStartMs = getUTCDateTime(AVAILABLE_START).toMillis()
  const availableStart = getUTCDateTime(
    Math.min(defaultAvailableStartMs, datasetsExtent.extentStart || Infinity)
  ).toISO() as string
  return availableStart
})

export const selectAvailableEnd = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableEndMs = getUTCDateTime(AVAILABLE_END).toMillis()
  const availableEndMs = getUTCDateTime(
    Math.max(defaultAvailableEndMs, datasetsExtent.extentEnd || -Infinity)
  )
    .endOf('day')
    .toISO() as string
  return availableEndMs
})

export const selectTimebarSelectedDataviews = createSelector(
  [
    selectTimebarVisualisation,
    selectTimebarSelectedEnvId,
    selectTimebarSelectedVGId,
    selectActiveDetectionsDataviews,
    selectActiveActivityDataviews,
    selectActiveVesselGroupDataviews,
    selectActiveHeatmapEnvironmentalDataviewsWithoutStatic,
    selectReportCategory,
    selectIsAnyAreaReportLocation,
  ],
  (
    timebarVisualisation,
    timebarSelectedEnvId,
    timebarSelectedVGId,
    detectionsDataviews,
    activityDataviews,
    vesselGroupDataviews,
    environmentalDataviews,
    reportCategory,
    isAreaReportLocation
  ) => {
    if (!timebarVisualisation) return []
    if (timebarVisualisation === TimebarVisualisations.Environment) {
      return environmentalDataviews.filter((d) => d.id === timebarSelectedEnvId)
    }
    if (timebarVisualisation === TimebarVisualisations.VesselGroup) {
      return vesselGroupDataviews.filter((d) => d.id === timebarSelectedVGId)
    }
    if (timebarVisualisation === TimebarVisualisations.HeatmapDetections) {
      return detectionsDataviews
    }

    return isAreaReportLocation
      ? activityDataviews.filter((d) => getReportCategoryFromDataview(d) === reportCategory)
      : activityDataviews
  }
)

export const selectTimebarSelectedVisualizationMode = createSelector(
  [
    selectTimebarSelectedDataviews,
    selectActivityVisualizationMode,
    selectDetectionsVisualizationMode,
  ],
  (timebarDataviews, activityVisualizationMode, detectionsVisualizationMode) => {
    if (timebarDataviews[0]?.category === DataviewCategory.Activity) {
      return activityVisualizationMode
    }
    if (timebarDataviews[0]?.category === DataviewCategory.Detections) {
      return detectionsVisualizationMode
    }
  }
)
