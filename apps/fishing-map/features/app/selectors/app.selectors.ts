import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { MapAnnotation, Ruler } from '@globalfishingwatch/layer-composer'
import { selectWorkspaceStateProperty } from 'features/workspace/workspace.selectors'
import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/datasets/datasets.utils'
import { BivariateDataviews, VisibleEvents, WorkspaceActivityCategory } from 'types'
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

export const selectActivityCategory = createSelector(
  [selectWorkspaceStateProperty('activityCategory')],
  (activityCategory): WorkspaceActivityCategory => {
    return activityCategory
  }
)

export const selectBivariateDataviews = createSelector(
  [selectWorkspaceStateProperty('bivariateDataviews')],
  (bivariate): BivariateDataviews => {
    return bivariate
  }
)

export const selectReadOnly = createSelector(
  [selectWorkspaceStateProperty('readOnly')],
  (readOnly): boolean => {
    return readOnly
  }
)

export const selectSidebarOpen = createSelector(
  [selectWorkspaceStateProperty('sidebarOpen')],
  (sidebarOpen): boolean => {
    return sidebarOpen
  }
)

export const selectAreMapRulersVisible = createSelector(
  [selectWorkspaceStateProperty('mapRulersVisible')],
  (mapRulersVisible): boolean => {
    return mapRulersVisible
  }
)

export const selectMapRulers = createSelector(
  [selectWorkspaceStateProperty('mapRulers')],
  (rulers = []): Ruler[] => {
    return rulers
  }
)

export const selectMapRulersVisible = createSelector(
  [selectMapRulers, selectAreMapRulersVisible],
  (rulers, areMapRulersVisible): Ruler[] => {
    return areMapRulersVisible ? rulers : []
  }
)

export const selectAreMapAnnotationsVisible = createSelector(
  [selectWorkspaceStateProperty('mapAnnotationsVisible')],
  (mapAnnotationsVisible): boolean => {
    return mapAnnotationsVisible
  }
)

export const selectMapAnnotations = createSelector(
  [selectWorkspaceStateProperty('mapAnnotations')],
  (mapAnnotations): MapAnnotation[] => {
    return mapAnnotations
  }
)

export const selectMapAnnotationsVisible = createSelector(
  [selectMapAnnotations, selectAreMapAnnotationsVisible],
  (mapAnnotations, areMapAnnotationsVisible): MapAnnotation[] => {
    return areMapAnnotationsVisible ? mapAnnotations : []
  }
)

export const selectVisibleEvents = createSelector(
  [selectWorkspaceStateProperty('visibleEvents')],
  (visibleEvents): VisibleEvents => {
    return visibleEvents
  }
)
