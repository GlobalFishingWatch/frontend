import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { HEATMAP_HIGH_RES_ID, RulerData } from '@globalfishingwatch/deck-layers'
import { selectWorkspaceStateProperty } from 'features/workspace/workspace.selectors'
import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/datasets/datasets.utils'
import { selectActiveDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectIsAnyReportLocation } from 'routes/routes.selectors'
import { MapAnnotation } from 'features/map/overlays/annotations/annotations.types'

const EMPTY_ARRAY: [] = []

export const selectLatestAvailableDataDate = createSelector(
  [selectActiveDataviewInstancesResolved],
  (dataviews) => {
    const activeDatasets = dataviews.flatMap((dataview) => {
      if (dataview.category === DataviewCategory.Context) {
        return EMPTY_ARRAY
      } else if (
        dataview.category === DataviewCategory.Activity ||
        dataview.category === DataviewCategory.Detections
      ) {
        return getActiveActivityDatasetsInDataviews([dataview]).flat()
      }
      return dataview.datasets || []
    })
    return getLatestEndDateFromDatasets(activeDatasets)
  }
)

export const selectActivityCategory = selectWorkspaceStateProperty('activityCategory')
export const selectBivariateDataviews = selectWorkspaceStateProperty('bivariateDataviews')
export const selectReadOnly = selectWorkspaceStateProperty('readOnly')
export const selectSidebarOpen = selectWorkspaceStateProperty('sidebarOpen')
export const selectAreMapRulersVisible = selectWorkspaceStateProperty('mapRulersVisible')
export const selectMapRulers = selectWorkspaceStateProperty('mapRulers')
export const selectAreMapAnnotationsVisible = selectWorkspaceStateProperty('mapAnnotationsVisible')
export const selectMapAnnotations = selectWorkspaceStateProperty('mapAnnotations')
export const selectVisibleEvents = selectWorkspaceStateProperty('visibleEvents')

export const selectActivityVisualizationMode = createSelector(
  [selectIsAnyReportLocation, selectWorkspaceStateProperty('activityVisualizationMode')],
  (isAnyReportLocation, activityVisualizationMode) => {
    if (isAnyReportLocation && activityVisualizationMode === 'positions') {
      return HEATMAP_HIGH_RES_ID
    }
    return activityVisualizationMode
  }
)

export const selectDetectionsVisualizationMode = createSelector(
  [selectIsAnyReportLocation, selectWorkspaceStateProperty('detectionsVisualizationMode')],
  (isAnyReportLocation, detectionsVisualizationMode) => {
    if (isAnyReportLocation && detectionsVisualizationMode === 'positions') {
      return 'heatmap-high-res'
    }
    return detectionsVisualizationMode
  }
)

export const selectEnvironmentVisualizationMode = createSelector(
  [selectWorkspaceStateProperty('environmentVisualizationMode')],
  (environmentVisualizationMode) => {
    return environmentVisualizationMode || 'heatmap-low-res'
  }
)

export const selectMapRulersVisible = createSelector(
  [selectMapRulers, selectAreMapRulersVisible],
  (rulers, areMapRulersVisible): RulerData[] => {
    return areMapRulersVisible ? rulers : []
  }
)
