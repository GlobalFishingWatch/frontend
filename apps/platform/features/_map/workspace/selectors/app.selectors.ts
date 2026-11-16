import { createSelector } from '@reduxjs/toolkit'

import type { RulerData } from '@globalfishingwatch/deck-layers'
// Leaf subpath: PlatformLayout reads selectReadOnly from this module, so it is in the always-loaded
// graph and the root barrel would put all of deck.gl in every page's entry chunk.
import { HEATMAP_HIGH_RES_ID, HEATMAP_ID } from '@globalfishingwatch/deck-layers/config'

import { selectWorkspaceStateProperty } from 'features/_map/workspace/workspace.selectors'
import { selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { selectIsAnyAreaReportLocation } from 'router/routes.selectors'

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

// Positions tiles require login, guests fall back to the default heatmap
export const selectActivityVisualizationMode = createSelector(
  [
    selectIsAnyAreaReportLocation,
    selectIsGuestUser,
    selectWorkspaceStateProperty('activityVisualizationMode'),
  ],
  (isAnyReportLocation, guestUser, activityVisualizationMode) => {
    if (activityVisualizationMode === 'positions') {
      if (isAnyReportLocation) return HEATMAP_HIGH_RES_ID
      if (guestUser) return HEATMAP_ID
    }
    return activityVisualizationMode
  }
)

export const selectDetectionsVisualizationMode = createSelector(
  [
    selectIsAnyAreaReportLocation,
    selectIsGuestUser,
    selectWorkspaceStateProperty('detectionsVisualizationMode'),
  ],
  (isAnyReportLocation, guestUser, detectionsVisualizationMode) => {
    if (detectionsVisualizationMode === 'positions') {
      if (isAnyReportLocation) return HEATMAP_HIGH_RES_ID
      if (guestUser) return HEATMAP_ID
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
