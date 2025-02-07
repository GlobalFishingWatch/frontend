import { createSelector } from '@reduxjs/toolkit'

import type { DataviewInstance, Workspace } from '@globalfishingwatch/api-types'

import { APP_NAME } from 'data/config'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import {
  selectActivityCategory,
  selectAreMapAnnotationsVisible,
  selectAreMapRulersVisible,
  selectBivariateDataviews,
  selectMapAnnotations,
  selectMapRulers,
  selectSidebarOpen,
  selectVisibleEvents,
} from 'features/app/selectors/app.selectors'
import {
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarVisualisation,
  selectTimeRange,
} from 'features/app/selectors/app.timebar.selectors'
import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { selectDataviewInstancesMergedOrdered } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/reports/report-area/area-reports.selectors'
import {
  selectReportActivityGraph,
  selectReportAreaBounds,
  selectReportTimeComparison,
  selectReportVesselFilter,
  selectReportVesselPage,
  selectReportVesselResultsPerPage,
} from 'features/reports/reports.config.selectors'
import { selectReportCategory, selectReportVesselGraph } from 'features/reports/reports.selectors'
import { selectDaysFromLatest, selectWorkspace } from 'features/workspace/workspace.selectors'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { selectLocationCategory } from 'routes/routes.selectors'

const selectWorkspaceReportState = createSelector(
  [
    selectReportActivityGraph,
    selectReportAreaBounds,
    selectReportCategory,
    selectReportVesselResultsPerPage,
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

const selectWorkspaceAppState = createSelector(
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
    selectDaysFromLatest,
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
    reportState,
    daysFromLatest
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
      daysFromLatest,
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
      category: category || DEFAULT_WORKSPACE_CATEGORY,
      viewport: viewport as Workspace['viewport'],
      startAt: timerange.start,
      endAt: timerange.end,
      state,
      dataviewInstances: dataviewInstances
        .filter((d) => !d.deleted)
        .map((dvI) => {
          const { datasetsConfigMigration, ...rest } = dvI
          return rest
        }) as DataviewInstance<any>[],
    }
  }
)
