import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'
import type { Query } from 'redux-first-router'
import type { QueryParams,WorkspaceParam } from 'types'

import { WorkspaceCategory } from 'data/workspaces'

import type { ROUTE_TYPES } from './routes'
import {
  PORT_REPORT,
  REPORT,
  ROUTES_WITH_WORKSPACES,
  SEARCH,
  USER,
  VESSEL,
  VESSEL_GROUP_REPORT,
  WORKSPACE_REPORT,
  WORKSPACE_ROUTES,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from './routes'

const selectLocation = (state: RootState) => state.location

export const selectLocationType = createSelector(
  [selectLocation],
  (location) => location.type as ROUTE_TYPES
)

export const selectIsWorkspaceLocation = createSelector([selectLocationType], (locationType) =>
  WORKSPACE_ROUTES.includes(locationType)
)

export const selectIsRouteWithWorkspace = createSelector([selectLocationType], (locationType) =>
  ROUTES_WITH_WORKSPACES.includes(locationType)
)

export const selectIsVesselLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === VESSEL
)

export const selectIsWorkspaceVesselLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === WORKSPACE_VESSEL
)

export const selectIsAnyVesselLocation = createSelector(
  [selectIsVesselLocation, selectIsWorkspaceVesselLocation],
  (isVesselLocation, isWorkspaceVesselLocation) => isVesselLocation || isWorkspaceVesselLocation
)

const selectisAreaReportLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === REPORT
)

const selectIsWorkspaceReportLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === WORKSPACE_REPORT
)

export const selectIsAnyAreaReportLocation = createSelector(
  [selectisAreaReportLocation, selectIsWorkspaceReportLocation],
  (isAreaReportLocation, isWorkspaceReportLocation) =>
    isAreaReportLocation || isWorkspaceReportLocation
)

export const selectIsPortReportLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === PORT_REPORT
)

export const selectIsVesselGroupReportLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === VESSEL_GROUP_REPORT
)

export const selectIsAnyReportLocation = createSelector(
  [selectIsAnyAreaReportLocation, selectIsPortReportLocation, selectIsVesselGroupReportLocation],
  (isAreaReportLocation, isPortReportLocation, isVesselGroupReportLocation) =>
    isAreaReportLocation || isPortReportLocation || isVesselGroupReportLocation
)

export const selectIsWorkspacesListLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === WORKSPACES_LIST
)

export const selectIsUserLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === USER
)

export const selectIsStandaloneSearchLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === SEARCH
)

const selectIsWorkspaceSearchLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === WORKSPACE_SEARCH
)

export const selectIsAnySearchLocation = createSelector(
  [selectIsStandaloneSearchLocation, selectIsWorkspaceSearchLocation],
  (searchLocation, workspaceSearchLocation) => searchLocation || workspaceSearchLocation
)

export const selectLocationQuery = createSelector(
  [selectLocation],
  (location) => location.query as Query
)

type QueryParamProperty<P extends WorkspaceParam> = Required<QueryParams>[P]
export function selectQueryParam<P extends WorkspaceParam>(param: P) {
  return createSelector([selectLocationQuery], (query: any): QueryParamProperty<P> => {
    return query?.[param] as QueryParamProperty<P>
  })
}

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => payload)

export const selectWorkspaceId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.workspaceId
)

export const selectReportId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.reportId
)

export const selectVesselId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.vesselId as string
)

export const selectReportVesselGroupId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.vesselGroupId as string
)

export const selectReportPortId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.portId as string
)

export const selectLocationCategory = createSelector(
  [selectLocationPayload],
  (payload) => payload?.category as WorkspaceCategory
)

export const selectLocationDatasetId = createSelector([selectLocationPayload], (payload) =>
  payload?.datasetId ? decodeURIComponent(payload?.datasetId) : ''
)

export const selectLocationAreaId = createSelector([selectLocationPayload], (payload) =>
  payload?.areaId ? decodeURIComponent(payload?.areaId) : ''
)

export const isValidLocationCategory = createSelector(
  [selectLocationCategory],
  (locationCategory) => Object.values(WorkspaceCategory).includes(locationCategory)
)

export const selectIsMarineManagerLocation = createSelector(
  [selectLocationCategory, selectWorkspaceId],
  (category, workspaceId) => {
    return category === WorkspaceCategory.MarineManager && !workspaceId
  }
)

const selectIsFishingIndexLocation = createSelector(
  [selectLocationCategory, selectWorkspaceId],
  (category, workspaceId) => {
    return category === WorkspaceCategory.FishingActivity && !workspaceId
  }
)

export const selectIsWorkspaceIndexLocation = createSelector(
  [selectIsMarineManagerLocation, selectIsFishingIndexLocation],
  (isMarineManagerLocation, isFishingIndexLocation) => {
    return isMarineManagerLocation || isFishingIndexLocation
  }
)

export const selectUserTab = selectQueryParam('userTab')
export const selectUrlMapZoomQuery = selectQueryParam('zoom')
const selectUrlMapLatitudeQuery = selectQueryParam('latitude')
const selectUrlMapLongitudeQuery = selectQueryParam('longitude')
export const selectUrlStartQuery = selectQueryParam('start')
export const selectUrlEndQuery = selectQueryParam('end')
export const selectUrlBufferValueQuery = selectQueryParam('reportBufferValue')
export const selectUrlBufferUnitQuery = selectQueryParam('reportBufferUnit')
export const selectUrlBufferOperationQuery = selectQueryParam('reportBufferOperation')
export const selectUrlDataviewInstances = selectQueryParam('dataviewInstances')

export const selectUrlDataviewInstancesOrder = selectQueryParam('dataviewInstancesOrder')

export const selectMapDrawingMode = selectQueryParam('mapDrawing')
export const selectMapDrawingEditId = selectQueryParam('mapDrawingEditId')

export const selectIsMapDrawing = createSelector([selectMapDrawingMode], (mapDrawingMode) => {
  return mapDrawingMode === 'polygons' || mapDrawingMode === 'points'
})

export const selectUrlViewport = createSelector(
  [selectUrlMapZoomQuery, selectUrlMapLatitudeQuery, selectUrlMapLongitudeQuery],
  (zoom, latitude, longitude) => {
    if (!zoom && !latitude && !longitude) return
    return { zoom, latitude, longitude }
  }
)

export const selectUrlTimeRange = createSelector(
  [selectUrlStartQuery, selectUrlEndQuery],
  (start, end) => {
    if (!start || !end) return null
    return {
      start: decodeURIComponent(start),
      end: decodeURIComponent(end),
    }
  }
)
