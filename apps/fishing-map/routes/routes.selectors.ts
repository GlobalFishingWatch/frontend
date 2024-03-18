import { createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { Query, RouteObject } from 'redux-first-router'
import { RootState } from 'reducers'
import { WorkspaceParam, QueryParams } from 'types'
import { WorkspaceCategory } from 'data/workspaces'
import {
  REPORT,
  WORKSPACE_REPORT,
  ROUTE_TYPES,
  VESSEL,
  WORKSPACE_ROUTES,
  WORKSPACE_VESSEL,
  SEARCH,
  USER,
  WORKSPACES_LIST,
  WORKSPACE_SEARCH,
} from './routes'

const selectLocation = (state: RootState) => state.location

export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationType = createSelector(
  [selectLocation],
  (location) => location.type as ROUTE_TYPES
)

export const selectIsWorkspaceLocation = createSelector([selectLocationType], (locationType) =>
  WORKSPACE_ROUTES.includes(locationType)
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

export const selectIsReportLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === REPORT
)
export const selectIsWorkspaceReportLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === WORKSPACE_REPORT
)

export const selectIsAnyReportLocation = createSelector(
  [selectIsReportLocation, selectIsWorkspaceReportLocation],
  (isReportLocation, isWorkspaceReportLocation) => isReportLocation || isWorkspaceReportLocation
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

export const selectIsWorkspaceSearchLocation = createSelector(
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

export const selectLocationSearch = createSelector(
  [selectLocation],
  (location) => location.search as string
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
  (payload) => payload?.vesselId
)

export const selectLocationCategory = createSelector(
  [selectLocationPayload],
  (payload) => payload?.category as WorkspaceCategory
)

export const selectLocationDatasetId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.datasetId as string
)

export const selectLocationAreaId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.areaId as number
)

export const selectLocationVesselId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.vesselId as string
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

export const selectUserTab = selectQueryParam('userTab')
export const selectUrlMapZoomQuery = selectQueryParam('zoom')
export const selectUrlMapLatitudeQuery = selectQueryParam('latitude')
export const selectUrlMapLongitudeQuery = selectQueryParam('longitude')
export const selectUrlStartQuery = selectQueryParam('start')
export const selectUrlEndQuery = selectQueryParam('end')
export const selectUrlBufferValueQuery = selectQueryParam('reportBufferValue')
export const selectUrlBufferUnitQuery = selectQueryParam('reportBufferUnit')
export const selectUrlBufferOperationQuery = selectQueryParam('reportBufferOperation')
export const selectUrlDataviewInstances = selectQueryParam('dataviewInstances')
export const selectActivityVisualizationMode = selectQueryParam('activityVisualizationMode')
export const selectDetectionsVisualizationMode = selectQueryParam('detectionsVisualizationMode')

export const selectUrlDataviewInstancesOrder = selectQueryParam('dataviewInstancesOrder')

export const selectIsMapDrawing = selectQueryParam('mapDrawing')
export const selectMapDrawingEditId = selectQueryParam('mapDrawingEditId')

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
    return { start, end }
  }
)

export const selectUrlDataviewInstancesById = memoize((id: string) =>
  createSelector([selectUrlDataviewInstances], (urlDataviewInstances) =>
    urlDataviewInstances?.find((dataviewInstance) => dataviewInstance?.id === id)
  )
)
