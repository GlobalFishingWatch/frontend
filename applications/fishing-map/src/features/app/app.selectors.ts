import { createSelector } from '@reduxjs/toolkit'
import { DataviewInstance, WorkspaceUpsert } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_WORKSPACE } from 'data/config'
import {
  selectWorkspace,
  selectWorkspaceState,
  selectWorkspaceTimeRange,
  selectWorkspaceViewport,
} from 'features/workspace/workspace.selectors'
import {
  selectQueryParam,
  selectUrlViewport,
  selectUrlTimeRange,
  selectLocationCategory,
  selectActivityCategory,
} from 'routes/routes.selectors'
import {
  BivariateDataviews,
  TimebarEvents,
  TimebarGraphs,
  TimebarVisualisations,
  WorkspaceAnalysis,
  WorkspaceState,
  WorkspaceStateProperty,
} from 'types'
import {
  selectActiveVesselsDataviews,
  selectDataviewInstancesMerged,
} from 'features/dataviews/dataviews.selectors'

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
  ({ start, end }, workspaceTimerange) => {
    return {
      start: start || workspaceTimerange?.start,
      end: end || workspaceTimerange?.end,
    }
  }
)

export const selectWorkspaceStateProperty = (property: WorkspaceStateProperty) =>
  createSelector(
    [selectQueryParam(property), selectWorkspaceState],
    (urlProperty, workspaceState) => {
      if (urlProperty !== undefined) return urlProperty
      return workspaceState[property] ?? DEFAULT_WORKSPACE[property]
    }
  )

export const selectAnalysisQuery = createSelector(
  [selectWorkspaceStateProperty('analysis')],
  (analysis): WorkspaceAnalysis => {
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

export const selectTimebarEvents = createSelector(
  [selectWorkspaceStateProperty('timebarEvents')],
  (timebarEvents): TimebarEvents => {
    return timebarEvents
  }
)

export const selectTimebarGraph = createSelector(
  [selectWorkspaceStateProperty('timebarGraph'), selectActiveVesselsDataviews],
  (timebarGraph, vessels): TimebarGraphs => {
    return vessels && vessels.length ? timebarGraph : TimebarGraphs.None
  }
)

export const selectWorkspaceAppState = createSelector(
  [
    selectBivariateDataviews,
    selectSidebarOpen,
    selectTimebarVisualisation,
    selectTimebarEvents,
    selectTimebarGraph,
    selectActivityCategory,
  ],
  (
    bivariateDataviews,
    sidebarOpen,
    timebarVisualisation,
    timebarEvents,
    timebarGraph,
    activityCategory
  ) => {
    return {
      bivariateDataviews,
      sidebarOpen,
      timebarVisualisation,
      timebarEvents,
      timebarGraph,
      activityCategory,
    }
  }
)

export const selectCustomWorkspace = createSelector(
  [
    selectWorkspace,
    selectViewport,
    selectTimeRange,
    selectLocationCategory,
    selectWorkspaceAppState,
    selectDataviewInstancesMerged,
  ],
  (
    workspace,
    viewport,
    timerange,
    category,
    state,
    dataviewInstances
  ): WorkspaceUpsert<WorkspaceState> => {
    return {
      ...workspace,
      app: APP_NAME,
      public: true,
      category,
      aoi: undefined,
      dataviews: workspace?.dataviews?.map(({ id }) => id as number),
      viewport,
      startAt: timerange.start,
      endAt: timerange.end,
      state,
      dataviewInstances: dataviewInstances as DataviewInstance<any>[],
    }
  }
)
