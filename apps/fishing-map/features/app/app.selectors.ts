import { createSelector } from '@reduxjs/toolkit'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_WORKSPACE } from 'data/config'
import {
  selectWorkspace,
  selectWorkspaceStateProperty,
  selectWorkspaceTimeRange,
  selectWorkspaceViewport,
} from 'features/workspace/workspace.selectors'
import { Range } from 'features/timebar/timebar.slice'
import {
  selectUrlViewport,
  selectLocationCategory,
  selectUrlTimeRange,
} from 'routes/routes.selectors'
import {
  BivariateDataviews,
  TimebarGraphs,
  TimebarVisualisations,
  VisibleEvents,
  WorkspaceAnalysis,
  WorkspaceAnalysisTimeComparison,
  WorkspaceAnalysisType,
} from 'types'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import {
  selectActiveVesselsDataviews,
  selectDataviewInstancesMerged,
} from 'features/dataviews/dataviews.slice'
import { RootState } from 'store'

export const selectViewport = createSelector(
  [selectUrlViewport, selectWorkspaceViewport],
  (urlViewport, workspaceViewport) => {
    return {
      zoom: urlViewport?.zoom || workspaceViewport?.zoom || DEFAULT_WORKSPACE.zoom,
      latitude: urlViewport?.latitude || workspaceViewport?.latitude || DEFAULT_WORKSPACE.latitude,
      longitude:
        urlViewport?.longitude || workspaceViewport?.longitude || DEFAULT_WORKSPACE.longitude,
    }
  }
)

export const selectTimeRange = createSelector(
  [selectUrlTimeRange, selectWorkspaceTimeRange],
  (urlTimerange, workspaceTimerange) => {
    return {
      start: urlTimerange?.start || workspaceTimerange?.start || DEFAULT_TIME_RANGE.start,
      end: urlTimerange?.end || workspaceTimerange?.end || DEFAULT_TIME_RANGE.end,
    } as Range
  }
)

export const selectAnalysisQuery = createSelector(
  [selectWorkspaceStateProperty('analysis')],
  (analysis): WorkspaceAnalysis => {
    return analysis
  }
)

export const selectAnalysisTypeQuery = createSelector(
  [selectWorkspaceStateProperty('analysisType')],
  (analysis): WorkspaceAnalysisType => {
    return analysis || 'evolution'
  }
)

export const selectAnalysisTimeComparison = createSelector(
  [selectWorkspaceStateProperty('analysisTimeComparison')],
  (analysis): WorkspaceAnalysisTimeComparison => {
    return analysis
  }
)

export const selectSearchQuery = createSelector(
  [selectWorkspaceStateProperty('query')],
  (query): string => {
    return query
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

export const selectDaysFromLatest = createSelector(
  [selectWorkspaceStateProperty('daysFromLatest')],
  (daysFromLatest): number => {
    return daysFromLatest
  }
)

export const selectSidebarOpen = createSelector(
  [selectWorkspaceStateProperty('sidebarOpen')],
  (sidebarOpen): boolean => {
    return sidebarOpen
  }
)

export const selectTimebarVisualisation = createSelector(
  [selectWorkspaceStateProperty('timebarVisualisation')],
  (timebarVisualisation): TimebarVisualisations => {
    return timebarVisualisation
  }
)

export const selectTimebarSelectedEnvId = createSelector(
  [selectWorkspaceStateProperty('timebarSelectedEnvId')],
  (timebarSelectedEnvId): string => {
    return timebarSelectedEnvId
  }
)

export const selectVisibleEvents = createSelector(
  [selectWorkspaceStateProperty('visibleEvents')],
  (visibleEvents): VisibleEvents => {
    return visibleEvents
  }
)

export const selectTimebarGraph = createSelector(
  [
    selectWorkspaceStateProperty('timebarGraph'),
    (state: RootState) => selectActiveVesselsDataviews(state),
  ],
  (timebarGraph, vessels): TimebarGraphs => {
    return vessels && vessels.length ? timebarGraph : TimebarGraphs.None
  }
)

export const selectWorkspaceAppState = createSelector(
  [
    selectBivariateDataviews,
    selectSidebarOpen,
    selectTimebarVisualisation,
    selectVisibleEvents,
    selectTimebarGraph,
  ],
  (bivariateDataviews, sidebarOpen, timebarVisualisation, visibleEvents, timebarGraph) => {
    return {
      bivariateDataviews,
      sidebarOpen,
      timebarVisualisation,
      visibleEvents,
      timebarGraph,
    }
  }
)

export const selectWorkspaceWithCurrentState = createSelector(
  [
    selectWorkspace,
    selectViewport,
    selectTimeRange,
    selectLocationCategory,
    selectWorkspaceAppState,
    (state: RootState) => selectDataviewInstancesMerged(state),
  ],
  (workspace, viewport, timerange, category, state, dataviewInstances): AppWorkspace => {
    return {
      ...workspace,
      app: APP_NAME,
      category,
      aoi: undefined,
      viewport,
      startAt: timerange.start,
      endAt: timerange.end,
      state,
      dataviewInstances: dataviewInstances as DataviewInstance<any>[],
    }
  }
)
