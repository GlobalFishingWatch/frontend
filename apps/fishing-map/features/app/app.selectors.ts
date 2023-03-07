import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  APP_NAME,
  DEFAULT_TIME_RANGE,
  DEFAULT_WORKSPACE,
  REPORT_VESSELS_GRAPH_FLAG,
} from 'data/config'
import { createDeepEqualSelector } from 'utils/selectors'
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
  Bbox,
  BivariateDataviews,
  ReportCategory,
  ReportActivityTimeComparison,
  ReportVesselGraph,
  TimebarGraphs,
  TimebarVisualisations,
  VisibleEvents,
  WorkspaceActivityCategory,
  ReportActivityGraph,
} from 'types'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import {
  selectActiveVesselsDataviews,
  selectDataviewInstancesMergedOrdered,
} from 'features/dataviews/dataviews.slice'
import { RootState } from 'store'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectEnvironmentalDataviews,
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
  (urlTimerange, workspaceTimerange) => {
    return {
      start: urlTimerange?.start || workspaceTimerange?.start || DEFAULT_TIME_RANGE.start,
      end: urlTimerange?.end || workspaceTimerange?.end || DEFAULT_TIME_RANGE.end,
    } as Range
  }
)

export const selectReportTimeComparison = createSelector(
  [selectWorkspaceStateProperty('reportTimeComparison')],
  (reportTimeComparison): ReportActivityTimeComparison => {
    return reportTimeComparison
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

export const selectReportCategory = createSelector(
  [
    selectWorkspaceStateProperty('reportCategory'),
    selectActiveActivityDataviews,
    selectActiveDetectionsDataviews,
  ],
  (reportActivityGraph, activityDataviews, detectionsDataviews): ReportCategory => {
    if (reportActivityGraph) {
      return reportActivityGraph
    }
    return !activityDataviews?.length && detectionsDataviews?.length
      ? DataviewCategory.Detections
      : DataviewCategory.Activity
  }
)

export const selectReportAreaBounds = createSelector(
  [selectWorkspaceStateProperty('reportAreaBounds')],
  (reportAreaBounds): Bbox => {
    return reportAreaBounds
  }
)

export const selectReportAreaSource = createSelector(
  [selectWorkspaceStateProperty('reportAreaSource')],
  (reportAreaSource): string => {
    return reportAreaSource
  }
)

export const selectActiveReportDataviews = createDeepEqualSelector(
  [selectReportCategory, selectActiveActivityDataviews, selectActiveDetectionsDataviews],
  (reportCategory, activityDataviews = [], detectionsDataviews = []) => {
    return reportCategory === DataviewCategory.Activity ? activityDataviews : detectionsDataviews
  }
)

export const selectReportActivityGraph = createSelector(
  [selectWorkspaceStateProperty('reportActivityGraph')],
  (reportActivityGraph): ReportActivityGraph => {
    return reportActivityGraph
  }
)

export const selectReportVesselGraph = createSelector(
  [selectWorkspaceStateProperty('reportVesselGraph'), selectReportCategory],
  (reportVesselGraph, reportCategory): ReportVesselGraph => {
    if (reportCategory === DataviewCategory.Detections) return REPORT_VESSELS_GRAPH_FLAG
    return reportVesselGraph
  }
)

export const selectReportVesselFilter = createSelector(
  [selectWorkspaceStateProperty('reportVesselFilter')],
  (reportVesselFilter): string => {
    return reportVesselFilter
  }
)

export const selectReportVesselPage = createSelector(
  [selectWorkspaceStateProperty('reportVesselPage')],
  (reportVesselPage): number => {
    return parseInt(reportVesselPage)
  }
)

export const selectTimebarVisualisation = createSelector(
  [selectWorkspaceStateProperty('timebarVisualisation')],
  (timebarVisualisation): TimebarVisualisations => {
    return timebarVisualisation
  }
)

export const selectTimebarSelectedEnvId = createSelector(
  [
    selectWorkspaceStateProperty('timebarSelectedEnvId'),
    selectTimebarVisualisation,
    selectEnvironmentalDataviews,
  ],
  (timebarSelectedEnvId, timebarVisualisation, envDataviews): string => {
    if (timebarVisualisation === TimebarVisualisations.Environment) {
      return timebarSelectedEnvId || envDataviews[0]?.id
    }
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
    (state: RootState) => selectDataviewInstancesMergedOrdered(state),
  ],
  (workspace, viewport, timerange, category, state, dataviewInstances): AppWorkspace => {
    return {
      ...workspace,
      app: APP_NAME,
      category,
      viewport,
      startAt: timerange.start,
      endAt: timerange.end,
      state,
      dataviewInstances: dataviewInstances.filter((d) => !d.deleted) as DataviewInstance<any>[],
    }
  }
)
