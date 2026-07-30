import { createSelector } from '@reduxjs/toolkit'

import type { DataviewInstance, Workspace } from '@globalfishingwatch/api-types'

import { APP_NAME } from 'data/map/config'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/map/workspaces'
import { selectDataviewInstancesMergedOrdered } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
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
  selectVesselGroupsVisualizationMode,
  selectVisibleEvents,
} from 'features/_map/workspace/selectors/app.selectors'
import {
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarVisualisation,
  selectTimeRange,
} from 'features/_map/workspace/selectors/app.timebar.selectors'
import { selectViewport } from 'features/_map/workspace/selectors/app.viewport.selectors'
import {
  selectCollapsedSections,
  selectDaysFromLatest,
  selectTimeMode,
  selectWorkspace,
} from 'features/_map/workspace/workspace.selectors'
import type { AppWorkspace } from 'features/_map/workspaces-list/workspaces-list.slice'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/_reports/report-area/area-reports.buffer.selectors'
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
} from 'features/_reports/reports.config.selectors'
import { selectReportCategory, selectReportVesselGraph } from 'features/_reports/reports.selectors'
import type { ReportState } from 'features/_reports/reports.types'
import {
  selectLocationCategory,
  selectLonglineSetsInsight,
  selectMigramarLayer,
} from 'router/routes.selectors'
import type { WorkspaceState } from 'types'

export { selectWorkspaceCategory } from 'features/_map/workspace/workspace.selectors'

/** Makes every key required while still allowing undefined values **/
type Complete<T> = { [K in keyof T]-?: T[K] | undefined }

/** WorkspaceState that does not persist in workspace.state */
type NonPersistedWorkspaceStateKey =
  | 'dataviewInstances'
  | 'dataviewInstancesOrder'
  | 'latitude'
  | 'longitude'
  | 'zoom'
  | 'start'
  | 'end'
  | 'readOnly'
  | 'screenshotMode'
  | 'reportLoadVessels'
  | 'timebarSelectedUserId'
  | 'timebarSelectedVGId'
  | 'vesselsColorBy'
  | 'skipColorDomainSampling'

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
    reportVesselResultsPerPage,
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
    portsReportName,
    portsReportCountry,
    portsReportDatasetId,
    reportVesselOrderProperty,
    reportVesselOrderDirection,
    reportEventsGraph,
    reportEventsPortsFilter,
    reportEventsPortsPage,
    reportEventsPortsResultsPerPage,
    reportComparisonDataviewIds
  ): Complete<ReportState> => ({
    reportActivityGraph,
    reportAreaBounds,
    reportCategory,
    reportVesselResultsPerPage,
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
    portsReportName,
    portsReportCountry,
    portsReportDatasetId,
    reportVesselOrderProperty,
    reportVesselOrderDirection,
    reportEventsGraph,
    reportEventsPortsFilter,
    reportEventsPortsPage,
    reportEventsPortsResultsPerPage,
    reportComparisonDataviewIds,
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
    selectDaysFromLatest,
    selectActivityVisualizationMode,
    selectDetectionsVisualizationMode,
    selectEnvironmentVisualizationMode,
    selectVesselGroupsVisualizationMode,
    selectCollapsedSections,
    selectTimeMode,
    selectWorkspaceReportState,
    selectLonglineSetsInsight,
    selectMigramarLayer,
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
    daysFromLatest,
    activityVisualizationMode,
    detectionsVisualizationMode,
    environmentVisualizationMode,
    vesselGroupsVisualizationMode,
    collapsedSections,
    timeMode,
    reportState,
    longlineSetsInsight,
    migramarLayer
  ): Complete<Omit<WorkspaceState, NonPersistedWorkspaceStateKey>> & Complete<ReportState> => {
    return {
      activityCategory,
      bivariateDataviews,
      collapsedSections,
      mapAnnotations,
      mapAnnotationsVisible,
      mapRulers,
      mapRulersVisible,
      sidebarOpen,
      timebarGraph,
      timebarSelectedEnvId,
      timebarVisualisation,
      timeMode,
      visibleEvents,
      activityVisualizationMode,
      detectionsVisualizationMode,
      environmentVisualizationMode,
      vesselGroupsVisualizationMode,
      daysFromLatest,
      longlineSetsInsight,
      migramarLayer,
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
      category: category || DEFAULT_WORKSPACE_CATEGORY,
      viewport: viewport as Workspace['viewport'],
      startAt: timerange.start,
      endAt: timerange.end,
      state,
      dataviewInstances: dataviewInstances
        ?.filter((d) => d && !d.deleted && !d.injected)
        ?.map((dvI) => {
          const { datasetsConfigMigration, ...rest } = dvI
          return rest
        }) as DataviewInstance[],
    }
  }
)
