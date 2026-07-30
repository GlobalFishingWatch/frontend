import { createSelector } from '@reduxjs/toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { RulerData } from '@globalfishingwatch/deck-layers'
// Leaf subpath: PlatformLayout reads selectReadOnly from this module, so it is in the always-loaded
// graph and the root barrel would put all of deck.gl in every page's entry chunk.
import { HEATMAP_HIGH_RES_ID } from '@globalfishingwatch/deck-layers/constants'

import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/map/datasets/datasets.utils'
import { selectDataviewInstancesResolvedVisible } from 'features/map/dataviews/selectors/dataviews.instances.selectors'
import { selectRealTimeLatestUpdate } from 'features/map/timebar/timebar.slice'
import {
  selectIsRealTimeMode,
  selectWorkspaceStateProperty,
} from 'features/map/workspace/workspace.selectors'
import { selectIsAnyAreaReportLocation } from 'router/routes.selectors'

const EMPTY_ARRAY: [] = []

export const selectLatestAvailableDataDate = createSelector(
  [selectIsRealTimeMode, selectRealTimeLatestUpdate, selectDataviewInstancesResolvedVisible],
  (isRealTimeMode, realTimeLatestUpdate, dataviews) => {
    if (isRealTimeMode && realTimeLatestUpdate) {
      return realTimeLatestUpdate
    }
    const activeDatasets = dataviews?.flatMap((dataview) => {
      if (!dataview || dataview.category === DataviewCategory.Context) {
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
export const selectScreenshotMode = selectWorkspaceStateProperty('screenshotMode')
export const selectSidebarOpen = selectWorkspaceStateProperty('sidebarOpen')
export const selectAreMapRulersVisible = selectWorkspaceStateProperty('mapRulersVisible')
export const selectMapRulers = selectWorkspaceStateProperty('mapRulers')
export const selectAreMapAnnotationsVisible = selectWorkspaceStateProperty('mapAnnotationsVisible')
export const selectMapAnnotations = selectWorkspaceStateProperty('mapAnnotations')
export const selectVisibleEvents = selectWorkspaceStateProperty('visibleEvents')
export const selectReportLoadVessels = selectWorkspaceStateProperty('reportLoadVessels')

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

export const selectVesselGroupsVisualizationMode = selectWorkspaceStateProperty(
  'vesselGroupsVisualizationMode'
)

export const selectSkipColorDomainSampling = selectWorkspaceStateProperty('skipColorDomainSampling')

export const selectMapRulersVisible = createSelector(
  [selectMapRulers, selectAreMapRulersVisible],
  (rulers, areMapRulersVisible): RulerData[] => {
    return areMapRulersVisible ? rulers : []
  }
)
