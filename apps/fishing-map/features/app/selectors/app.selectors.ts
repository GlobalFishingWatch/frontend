import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { MapAnnotation, Ruler } from '@globalfishingwatch/layer-composer'
import { selectWorkspaceStateProperty } from 'features/workspace/workspace.selectors'
import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/datasets/datasets.utils'
import { selectActiveDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'

export const selectLatestAvailableDataDate = createSelector(
  [selectActiveDataviewInstancesResolved],
  (dataviews) => {
    const activeDatasets = dataviews.flatMap((dataview) => {
      if (dataview.category === DataviewCategory.Context) {
        return []
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

export const selectMapRulersVisible = createSelector(
  [selectMapRulers, selectAreMapRulersVisible],
  (rulers, areMapRulersVisible): Ruler[] => {
    return areMapRulersVisible ? rulers : []
  }
)

export const selectMapAnnotationsVisible = createSelector(
  [selectMapAnnotations, selectAreMapAnnotationsVisible],
  (mapAnnotations, areMapAnnotationsVisible): MapAnnotation[] => {
    return areMapAnnotationsVisible ? mapAnnotations : []
  }
)
