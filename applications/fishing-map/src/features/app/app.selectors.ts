import { createSelector } from '@reduxjs/toolkit'
import { DataviewInstance, WorkspaceUpsert } from '@globalfishingwatch/api-types/dist'
import { getOceanAreaName } from '@globalfishingwatch/ocean-areas'
import { APP_NAME, DEFAULT_WORKSPACE } from 'data/config'
import {
  selectDataviewInstancesMerged,
  selectWorkspace,
  selectWorkspaceState,
  selectWorkspaceTimeRange,
  selectWorkspaceViewport,
} from 'features/workspace/workspace.selectors'
import {
  selectUrlMapZoomQuery,
  selectUrlMapLatitudeQuery,
  selectUrlMapLongitudeQuery,
  selectUrlEndQuery,
  selectUrlStartQuery,
  selectQueryParam,
} from 'routes/routes.selectors'
import {
  TimebarEvents,
  TimebarGraphs,
  TimebarVisualisations,
  WorkspaceState,
  WorkspaceStateProperty,
} from 'types'
import { selectUserData } from 'features/user/user.slice'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'

export const selectViewport = createSelector(
  [
    selectUrlMapZoomQuery,
    selectUrlMapLatitudeQuery,
    selectUrlMapLongitudeQuery,
    selectWorkspaceViewport,
  ],
  (zoom, latitude, longitude, workspaceViewport) => {
    return {
      zoom: zoom || workspaceViewport?.zoom || DEFAULT_WORKSPACE.zoom,
      latitude: latitude || workspaceViewport?.latitude || DEFAULT_WORKSPACE.latitude,
      longitude: longitude || workspaceViewport?.longitude || DEFAULT_WORKSPACE.longitude,
    }
  }
)

export const selectTimeRange = createSelector(
  [selectUrlStartQuery, selectUrlEndQuery, selectWorkspaceTimeRange],
  (start, end, workspaceTimerange) => {
    return {
      start: start || workspaceTimerange?.start || DEFAULT_WORKSPACE.start,
      end: end || workspaceTimerange?.end || DEFAULT_WORKSPACE.end,
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

export const selectSearchQuery = createSelector(
  [selectWorkspaceStateProperty('query')],
  (query): string => {
    return query
  }
)

export const selectBivariate = createSelector(
  [selectWorkspaceStateProperty('bivariate')],
  (bivariate): boolean => {
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
  [selectWorkspaceStateProperty('timebarGraph')],
  (timebarGraph): TimebarGraphs => {
    return timebarGraph
  }
)

export const selectWorkspaceAppState = createSelector(
  [
    selectSearchQuery,
    selectBivariate,
    selectSidebarOpen,
    selectTimebarVisualisation,
    selectTimebarEvents,
    selectTimebarGraph,
  ],
  (search, bivariate, sidebarOpen, timebarVisualisation, timebarEvents, timebarGraph) => {
    return { search, bivariate, sidebarOpen, timebarVisualisation, timebarEvents, timebarGraph }
  }
)

export const selectCustomWorkspace = createSelector(
  [
    selectUserData,
    selectWorkspace,
    selectViewport,
    selectTimeRange,
    selectWorkspaceAppState,
    selectDataviewInstancesMerged,
  ],
  (
    user,
    workspace,
    viewport,
    timerange,
    state,
    dataviewInstances
  ): WorkspaceUpsert<WorkspaceState> => {
    const areaName = getOceanAreaName(viewport)
    const dateFormat = pickDateFormatByRange(timerange.start as string, timerange.end as string)
    const start = formatI18nDate(timerange.start as string, {
      format: dateFormat,
    })
      .replace(',', '')
      .replace('.', '')
    const end = formatI18nDate(timerange.end as string, {
      format: dateFormat,
    })
      .replace(',', '')
      .replace('.', '')

    const name = `From ${start} to ${end} near ${areaName}`
    return {
      ...workspace,
      name,
      app: APP_NAME,
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
