import { createSelector } from '@reduxjs/toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { RulerData } from '@globalfishingwatch/deck-layers'
import { HEATMAP_HIGH_RES_ID } from '@globalfishingwatch/deck-layers'

import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/datasets/datasets.utils'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectWorkspaceStateProperty } from 'features/workspace/workspace.selectors'
import { selectIsAnyAreaReportLocation } from 'routes/routes.selectors'

const EMPTY_ARRAY: [] = []

export const selectLatestAvailableDataDate = createSelector(
  [selectDataviewInstancesResolvedVisible],
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
    }) as Dataset[]
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
  [selectIsAnyAreaReportLocation, selectWorkspaceStateProperty('activityVisualizationMode')],
  (isAnyReportLocation, activityVisualizationMode) => {
    if (isAnyReportLocation && activityVisualizationMode === 'positions') {
      return HEATMAP_HIGH_RES_ID
    }
    return activityVisualizationMode
  }
)

export const selectDetectionsVisualizationMode = createSelector(
  [selectIsAnyAreaReportLocation, selectWorkspaceStateProperty('detectionsVisualizationMode')],
  (isAnyReportLocation, detectionsVisualizationMode) => {
    if (isAnyReportLocation && detectionsVisualizationMode === 'positions') {
      return 'heatmap-high-res'
    }
    return detectionsVisualizationMode
  }
)

export const selectEnvironmentVisualizationMode = selectWorkspaceStateProperty(
  'environmentVisualizationMode'
)

export const selectMapRulersVisible = createSelector(
  [selectMapRulers, selectAreMapRulersVisible],
  (rulers, areMapRulersVisible): RulerData[] => {
    return areMapRulersVisible ? rulers : []
  }
)
