import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { uniq } from 'lodash'
import { DataviewCategory, DataviewInstance, Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_WORKSPACE } from 'data/config'
import { createDeepEqualSelector } from 'utils/selectors'
import {
  selectWorkspace,
  selectWorkspaceStateProperty,
  selectWorkspaceTimeRange,
  selectWorkspaceViewport,
} from 'features/workspace/workspace.selectors'
import {
  getActiveActivityDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/datasets/datasets.utils'
import { TimeRange } from 'features/timebar/timebar.slice'
import {
  selectUrlViewport,
  selectLocationCategory,
  selectUrlTimeRange,
  selectLocationDatasetId,
  selectLocationAreaId,
  selectReportId,
  selectIsAnyVesselLocation,
  selectUrlBufferValueQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferOperationQuery,
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
  BufferUnit,
  BufferOperation,
  MapAnnotation,
} from 'types'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import {
  selectActiveDataviewInstancesResolved,
  selectActiveVesselsDataviews,
  selectDataviewInstancesMergedOrdered,
  selectDataviewInstancesResolved,
} from 'features/dataviews/dataviews.slice'
import {
  selectActiveDetectionsDataviews,
  selectActiveEnvironmentalDataviews,
  selectActiveReportActivityDataviews,
  selectEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { getReportCategoryFromDataview } from 'features/reports/reports.utils'
import { selectReportById } from 'features/reports/reports.slice'

export const selectViewport = createSelector(
  [selectUrlViewport, selectWorkspaceViewport],
  (urlViewport, workspaceViewport) => {
    return {
      zoom: urlViewport?.zoom || workspaceViewport?.zoom || (DEFAULT_WORKSPACE.zoom as number),
      latitude:
        urlViewport?.latitude ||
        workspaceViewport?.latitude ||
        (DEFAULT_WORKSPACE.latitude as number),
      longitude:
        urlViewport?.longitude ||
        workspaceViewport?.longitude ||
        (DEFAULT_WORKSPACE.longitude as number),
    }
  }
)

export const selectTimeRange = createSelector(
  [selectUrlTimeRange, selectWorkspaceTimeRange],
  (urlTimerange, workspaceTimerange) => {
    return {
      start: urlTimerange?.start || workspaceTimerange?.start || DEFAULT_TIME_RANGE.start,
      end: urlTimerange?.end || workspaceTimerange?.end || DEFAULT_TIME_RANGE.end,
    } as TimeRange
  }
)

export const selectLatestAvailableDataDate = createSelector(
  [(state) => selectActiveDataviewInstancesResolved(state)],
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

export const selectReportTimeComparison = createSelector(
  [selectWorkspaceStateProperty('reportTimeComparison')],
  (reportTimeComparison): ReportActivityTimeComparison => {
    return reportTimeComparison
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

export const selectMapAnnotations = createSelector(
  [selectWorkspaceStateProperty('mapAnnotations')],
  (mapAnnotations): MapAnnotation[] => {
    return mapAnnotations
  }
)

export const selectCurrentReport = createSelector(
  [selectReportId, (state) => state.reports],
  (reportId, reports) => {
    const report = selectReportById(reportId)({ reports })
    return report
  }
)

export const selectReportDatasetId = createSelector(
  [selectLocationDatasetId, selectCurrentReport],
  (locationDatasetId, report) => (locationDatasetId || report?.datasetId) as string
)

export const selectReportAreaId = createSelector(
  [selectLocationAreaId, selectCurrentReport],
  (locationAreaId, report) => (locationAreaId || report?.areaId) as number
)

export const selectActiveDataviewsCategories = createSelector(
  [(state) => selectDataviewInstancesResolved(state)],
  (dataviews): ReportCategory[] => {
    return uniq(
      dataviews.flatMap((d) => (d.config?.visible ? getReportCategoryFromDataview(d) : []))
    )
  }
)

export const selectReportActiveCategories = createSelector(
  [selectActiveDataviewsCategories],
  (activeCategories): ReportCategory[] => {
    const orderedCategories = [
      ReportCategory.Fishing,
      ReportCategory.Presence,
      ReportCategory.Detections,
      ReportCategory.Environment,
    ]
    return orderedCategories.flatMap((category) =>
      activeCategories.some((a) => a === category) ? category : []
    )
  }
)

export const selectReportCategory = createSelector(
  [selectWorkspaceStateProperty('reportCategory'), selectReportActiveCategories],
  (reportCategory, activeCategories): ReportCategory => {
    return activeCategories.some((category) => category === reportCategory)
      ? reportCategory
      : activeCategories[0]
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

export function isActivityReport(reportCategory: ReportCategory) {
  return reportCategory === ReportCategory.Fishing || reportCategory === ReportCategory.Presence
}

export const selectActiveReportDataviews = createDeepEqualSelector(
  [
    selectReportCategory,
    selectActiveReportActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveEnvironmentalDataviews,
  ],
  (
    reportCategory,
    activityDataviews = [],
    detectionsDataviews = [],
    environmentalDataviews = []
  ) => {
    if (isActivityReport(reportCategory)) {
      return activityDataviews
    }
    if (reportCategory === ReportCategory.Detections) {
      return detectionsDataviews
    }
    return environmentalDataviews
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
    if (reportCategory === ReportCategory.Fishing && reportVesselGraph === 'vesselType') {
      return 'geartype'
    }
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

export const selectReportResultsPerPage = createSelector(
  [selectWorkspaceStateProperty('reportResultsPerPage')],
  (reportVesselPage): number => {
    return parseInt(reportVesselPage)
  }
)

export const selectReportBufferValue = createSelector(
  [selectWorkspaceStateProperty('reportBufferValue'), selectUrlBufferValueQuery],
  (workspaceBufferValue, urlBufferValue): number => {
    return workspaceBufferValue || urlBufferValue
  }
)

export const selectReportBufferUnit = createSelector(
  [selectWorkspaceStateProperty('reportBufferUnit'), selectUrlBufferUnitQuery],
  (workspaceBufferUnit, urlBufferUnit): BufferUnit => {
    return workspaceBufferUnit || urlBufferUnit
  }
)

export const selectReportBufferOperation = createSelector(
  [selectWorkspaceStateProperty('reportBufferOperation'), selectUrlBufferOperationQuery],
  (workspaceBufferOperation, urlBufferOperation): BufferOperation => {
    return workspaceBufferOperation || urlBufferOperation
  }
)

export const selectTimebarVisualisation = createSelector(
  [selectWorkspaceStateProperty('timebarVisualisation'), selectIsAnyVesselLocation],
  (timebarVisualisation, isAnyVesselLocation): TimebarVisualisations => {
    if (isAnyVesselLocation) return TimebarVisualisations.Vessel
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
    (state: RootState) => selectDataviewInstancesMergedOrdered(state),
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
