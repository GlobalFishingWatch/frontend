import { createSelector } from '@reduxjs/toolkit'
import { DataviewInstance, Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME } from 'data/config'
import {
  selectActivityCategory,
  selectBivariateDataviews,
  selectMapAnnotations,
  selectAreMapAnnotationsVisible,
  selectMapRulers,
  selectAreMapRulersVisible,
  selectSidebarOpen,
  selectVisibleEvents,
} from 'features/app/selectors/app.selectors'
import {
  selectReportActivityGraph,
  selectReportAreaBounds,
  selectReportAreaSource,
  selectReportCategory,
  selectReportResultsPerPage,
  selectReportTimeComparison,
  selectReportVesselFilter,
  selectReportVesselGraph,
  selectReportVesselPage,
  selectReportBufferValue,
  selectReportBufferUnit,
  selectReportBufferOperation,
} from 'features/app/selectors/app.reports.selector'
import {
  selectTimeRange,
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { selectLocationCategory } from 'routes/routes.selectors'
import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { selectDataviewInstancesMergedOrdered } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectWorkspace } from 'features/workspace/workspace.selectors'

export const selectWorkspaceReportState = createSelector(
  [
    selectReportActivityGraph,
    selectReportAreaBounds,
    selectReportAreaSource,
    selectReportCategory,
    selectReportResultsPerPage,
    selectReportTimeComparison,
    selectReportVesselFilter,
    selectReportVesselGraph,
    selectReportVesselPage,
    selectReportBufferValue,
    selectReportBufferUnit,
    selectReportBufferOperation,
  ],
  (
    reportActivityGraph,
    reportAreaBounds,
    reportAreaSource,
    reportCategory,
    reportResultsPerPage,
    reportTimeComparison,
    reportVesselFilter,
    reportVesselGraph,
    reportVesselPage,
    reportBufferValue,
    reportBufferUnit,
    reportBufferOperation
  ) => ({
    ...(reportActivityGraph && { reportActivityGraph }),
    ...(reportAreaBounds && { reportAreaBounds }),
    ...(reportAreaSource && { reportAreaSource }),
    ...(reportCategory && { reportCategory }),
    ...(reportResultsPerPage && { reportResultsPerPage }),
    ...(reportTimeComparison && { reportTimeComparison }),
    ...(reportVesselFilter && { reportVesselFilter }),
    ...(reportVesselGraph && { reportVesselGraph }),
    ...(reportVesselPage && { reportVesselPage }),
    ...(reportBufferValue && { reportBufferValue }),
    ...(reportBufferUnit && { reportBufferUnit }),
    ...(reportBufferOperation && { reportBufferOperation }),
  })
)

export const selectWorkspaceAppState = createSelector(
  [
    selectActivityCategory,
    selectBivariateDataviews,
    selectMapAnnotations,
    selectAreMapAnnotationsVisible,
    selectMapRulers,
    selectAreMapRulersVisible,
    selectSidebarOpen,
    selectTimebarGraph,
    selectTimebarSelectedEnvId,
    selectTimebarVisualisation,
    selectVisibleEvents,
    selectWorkspaceReportState,
  ],
  (
    activityCategory,
    bivariateDataviews,
    mapAnnotations,
    mapAnnotationsVisible,
    mapRulers,
    mapRulersVisible,
    sidebarOpen,
    timebarGraph,
    timebarSelectedEnvId,
    timebarVisualisation,
    visibleEvents,
    reportState
  ) => {
    return {
      activityCategory,
      bivariateDataviews,
      mapAnnotations,
      mapAnnotationsVisible,
      mapRulers,
      mapRulersVisible,
      sidebarOpen,
      timebarGraph,
      timebarSelectedEnvId,
      timebarVisualisation,
      visibleEvents,
      ...reportState,
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
    selectDataviewInstancesMergedOrdered,
  ],
  (workspace, viewport, timerange, category, state, dataviewInstances): AppWorkspace => {
    return {
      ...(workspace || ({} as Workspace)),
      app: APP_NAME,
      category,
      viewport: viewport as Workspace['viewport'],
      startAt: timerange.start,
      endAt: timerange.end,
      state,
      dataviewInstances: dataviewInstances.filter((d) => !d.deleted) as DataviewInstance<any>[],
    }
  }
)
