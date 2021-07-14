import { createSelector } from '@reduxjs/toolkit'
import { DataviewInstance, WorkspaceUpsert } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_WORKSPACE } from 'data/config'
import {
  selectWorkspace,
  selectWorkspaceState,
  selectWorkspaceTimeRange,
  selectWorkspaceViewport,
} from 'features/workspace/workspace.selectors'
import { Range } from 'features/timebar/timebar.slice'
import {
  selectQueryParam,
  selectUrlViewport,
  selectLocationCategory,
  selectUrlTimeRange,
} from 'routes/routes.selectors'
import {
  BivariateDataviews,
  TimebarGraphs,
  TimebarVisualisations,
  VisibleEvents,
  WorkspaceActivityCategory,
  WorkspaceAnalysis,
  WorkspaceState,
  WorkspaceStateProperty,
} from 'types'
import {
  selectActiveVesselsDataviews,
  selectDataviewInstancesMerged,
} from 'features/dataviews/dataviews.selectors'
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

const selectTimeRange = createSelector(
  [selectUrlTimeRange, selectWorkspaceTimeRange],
  (urlTimerange, workspaceTimerange) => {
    return {
      start: urlTimerange?.start || workspaceTimerange?.start || DEFAULT_TIME_RANGE.start,
      end: urlTimerange?.end || workspaceTimerange?.end || DEFAULT_TIME_RANGE.end,
    } as Range
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

export const selectActivityCategory = createSelector(
  [selectWorkspaceStateProperty('activityCategory')],
  (activityCategory): WorkspaceActivityCategory => {
    return activityCategory
  }
)

export function selectActivityCategoryFn(state: RootState) {
  return selectActivityCategory(state)
}

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

export const selectVisibleEvents = createSelector(
  [selectWorkspaceStateProperty('visibleEvents')],
  (visibleEvents): VisibleEvents => {
    return visibleEvents
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
    selectVisibleEvents,
    selectTimebarGraph,
    selectActivityCategory,
  ],
  (
    bivariateDataviews,
    sidebarOpen,
    timebarVisualisation,
    visibleEvents,
    timebarGraph,
    activityCategory
  ) => {
    return {
      bivariateDataviews,
      sidebarOpen,
      timebarVisualisation,
      visibleEvents,
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
