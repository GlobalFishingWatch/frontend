import { createSelector } from '@reduxjs/toolkit'
import { getDatasetsExtent } from '@globalfishingwatch/datasets-client'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { TimebarVisualisations } from 'types'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import {
  selectTimebarSelectedEnvId,
  selectTimebarSelectedVGId,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import { AVAILABLE_END, AVAILABLE_START } from 'data/config'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  selectActiveHeatmapEnvironmentalDataviewsWithoutStatic,
  selectActiveReportActivityDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import {
  selectActivityVisualizationMode,
  selectDetectionsVisualizationMode,
} from 'features/app/selectors/app.selectors'
import { getReportCategoryFromDataview } from 'features/reports/areas/area-reports.utils'
import { selectIsAnyReportLocation } from 'routes/routes.selectors'
import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveVesselGroupDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'

export const selectActiveActivityDataviewsByVisualisation = (
  timebarVisualisation: TimebarVisualisations
) =>
  createSelector(
    [
      selectActiveReportActivityDataviews,
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

const selectDatasetsExtent = createSelector(
  [selectDataviewInstancesResolved, selectAllDatasets],
  (dataviews, datasets) => {
    const activeDataviewDatasets = getDatasetsInDataviews(dataviews)
    const activeDatasets = datasets.filter((d) => activeDataviewDatasets.includes(d.id))
    return getDatasetsExtent<number>(activeDatasets, {
      format: 'timestamp',
    })
  }
)

export const selectAvailableStart = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableStartMs = new Date(AVAILABLE_START).getTime()
  const availableStart = new Date(
    Math.min(defaultAvailableStartMs, datasetsExtent.extentStart || Infinity)
  ).toISOString()
  return availableStart
})

export const selectAvailableEnd = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableEndMs = new Date(AVAILABLE_END).getTime()
  const availableEndMs = new Date(
    Math.max(defaultAvailableEndMs, datasetsExtent.extentEnd || -Infinity)
  ).toISOString()
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
    selectIsAnyReportLocation,
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
    isReportLocation
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

    return isReportLocation
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
