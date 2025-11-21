import { createSelector } from '@reduxjs/toolkit'

import type { DataviewInstance, Workspace } from '@globalfishingwatch/api-types'

import { APP_NAME } from 'data/config'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import {
  selectActivityCategory,
  selectActivityVisualizationMode,
  selectAreMapAnnotationsVisible,
  selectAreMapRulersVisible,
  selectBivariateDataviews,
  selectDetectionsVisualizationMode,
  selectEnvironmentVisualizationMode,
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
  selectPortReportCountry,
  selectPortReportDatasetId,
  selectPortReportName,
  selectReportActivityGraph,
  selectReportActivitySubCategorySelector,
  selectReportAreaBounds,
  selectReportComparisonDataviewIds,
  selectReportDetectionsSubCategorySelector,
  selectReportEventsGraph,
  selectReportEventsPortsFilter,
  selectReportEventsPortsPage,
  selectReportEventsPortsResultsPerPage,
  selectReportEventsSubCategorySelector,
  selectReportTimeComparison,
  selectReportVesselFilter,
  selectReportVesselPage,
  selectReportVesselResultsPerPage,
  selectReportVesselsOrderDirection,
  selectReportVesselsOrderProperty,
  selectReportVesselsSubCategory,
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
    selectReportActivitySubCategorySelector,
    selectReportDetectionsSubCategorySelector,
    selectReportEventsSubCategorySelector,
    selectReportVesselsSubCategory,
    selectPortReportName,
    selectPortReportCountry,
    selectPortReportDatasetId,
    selectReportVesselsOrderProperty,
    selectReportVesselsOrderDirection,
    selectReportEventsGraph,
    selectReportEventsPortsFilter,
    selectReportEventsPortsPage,
    selectReportEventsPortsResultsPerPage,
    selectReportComparisonDataviewIds,
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
    reportBufferOperation,
    reportActivitySubCategory,
    reportDetectionsSubCategory,
    reportEventsSubCategory,
    reportVesselsSubCategory,
    portReportName,
    portReportCountry,
    portReportDatasetId,
    reportVesselOrderProperty,
    reportVesselOrderDirection,
    reportEventsGraph,
    reportEventsPortsFilter,
    reportEventsPortsPage,
    reportEventsPortsResultsPerPage,
    reportComparisonDataviewIds
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
    ...(reportActivitySubCategory && { reportActivitySubCategory }),
    ...(reportDetectionsSubCategory && { reportDetectionsSubCategory }),
    ...(reportEventsSubCategory && { reportEventsSubCategory }),
    ...(reportVesselsSubCategory && { reportVesselsSubCategory }),
    ...(portReportName && { portReportName }),
    ...(portReportCountry && { portReportCountry }),
    ...(portReportDatasetId && { portReportDatasetId }),
    ...(reportVesselOrderProperty && { reportVesselOrderProperty }),
    ...(reportVesselOrderDirection && { reportVesselOrderDirection }),
    ...(reportEventsGraph && { reportEventsGraph }),
    ...(reportEventsPortsFilter && { reportEventsPortsFilter }),
    ...(reportEventsPortsPage && { reportEventsPortsPage }),
    ...(reportEventsPortsResultsPerPage && { reportEventsPortsResultsPerPage }),
    ...(reportComparisonDataviewIds && { reportComparisonDataviewIds }),
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
    selectActivityVisualizationMode,
    selectDetectionsVisualizationMode,
    selectEnvironmentVisualizationMode,
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
    daysFromLatest,
    activityVisualizationMode,
    detectionsVisualizationMode,
    environmentVisualizationMode
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
      activityVisualizationMode,
      detectionsVisualizationMode,
      environmentVisualizationMode,
      ...reportState,
      daysFromLatest,
    }
  }
)

export const selectWorkspaceCategory = createSelector(
  [selectLocationCategory, selectWorkspace],
  (locationCategory, workspace) => {
    return locationCategory || workspace?.category || DEFAULT_WORKSPACE_CATEGORY
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
        ?.filter((d) => d && !d.deleted)
        ?.map((dvI) => {
          const { datasetsConfigMigration, ...rest } = dvI
          return rest
        }) as DataviewInstance[],
    }
  }
)
