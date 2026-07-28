import {
  EEZ_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  FISHING_DATAVIEW_SLUG_AIS,
  LAYER_LIBRARY_ID_SEPARATOR,
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
} from '@fishing-map/config'

import { getUTCDate, stickToClosestInterval } from '@globalfishingwatch/data-transforms'
import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { resolveDataviewSlug } from './config'
import { getLayerInfo } from './dictionary'
import type { MapRoute, RouteNavigation } from './routes'
import { buildRoutePath, DEFAULT_BASENAME, getRouteNavigation } from './routes'

// Layer-library instances (id convention `<libraryId>__<unique>`) require a dataviewId;
// fill it from the dictionary when missing so agents don't have to know slugs
const withDataviewId = (instance: any) => {
  if (instance?.dataviewId) {
    return { ...instance, dataviewId: resolveDataviewSlug(String(instance.dataviewId)) }
  }
  if (instance?.id?.includes(LAYER_LIBRARY_ID_SEPARATOR)) {
    const { dataviewId } = getLayerInfo(instance.id)
    if (dataviewId) {
      return { ...instance, dataviewId }
    }
  }
  return instance
}

// Snaps start/end to the fourwings interval resolution the app will render with
// (month boundaries for ~year ranges, day for short ranges) — same functions the map uses
const withSnappedTimeRange = (state: MapState): MapState => {
  const start = typeof state.start === 'string' ? Date.parse(state.start) : NaN
  const end = typeof state.end === 'string' ? Date.parse(state.end) : NaN
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return state
  }
  const { start: newStart, end: newEnd } = stickToClosestInterval({ start, end })
  return {
    ...state,
    start: getUTCDate(newStart).toISOString(),
    end: getUTCDate(newEnd).toISOString(),
  }
}

// Area report datasets → the context layer instance that renders the area outline.
// Injected automatically so agents can't forget the boundary layer.
const AREA_DATASET_CONTEXT_LAYER: Record<string, string> = {
  'public-eez-areas': EEZ_DATAVIEW_INSTANCE_ID,
  'public-fao-major': FAO_AREAS_DATAVIEW_INSTANCE_ID,
  'public-rfmo': RFMO_DATAVIEW_INSTANCE_ID,
  'public-mpa-all': MPA_DATAVIEW_INSTANCE_ID,
}

const withReportContextLayers = (state: MapState, route: MapRoute): MapState => {
  if (route.type !== 'report' || !route.datasetId) {
    return state
  }
  const instances = (state.dataviewInstances as any[]) || []
  // Presence is checked by resolved dataview, not instance id: the boundary may already
  // render through a layer-library instance (e.g. `fao-major__<ts>` vs `context-layer-fao-areas`)
  const presentDataviews = new Set(
    instances.map((instance) => getLayerInfo(String(instance?.id ?? '')).dataviewId)
  )
  const missing = [...new Set(route.datasetId.split(','))]
    .map((datasetId) => AREA_DATASET_CONTEXT_LAYER[datasetId.trim()])
    .filter((id) => id && !presentDataviews.has(getLayerInfo(id).dataviewId))
  if (!missing.length) {
    return state
  }
  return {
    ...state,
    dataviewInstances: [...instances, ...missing.map((id) => ({ id, config: { visible: true } }))],
  }
}

// URL filters replace the dataview's own defaults, so an AIS apparent-fishing-effort
// layer that sets any filter must also carry the app default distance_from_port_km=3
// (filters out anchored vessels). Filterless instances keep the server-side default.
const withAisDefaultFilters = (state: MapState): MapState => {
  if (!state.dataviewInstances) {
    return state
  }
  return {
    ...state,
    dataviewInstances: (state.dataviewInstances as any[]).map((instance) => {
      if (!instance?.id) return instance
      const { dataviewId } = getLayerInfo(String(instance.id))
      if (dataviewId !== FISHING_DATAVIEW_SLUG_AIS) return instance
      const filters = instance.config?.filters
      if (!filters || !Object.keys(filters).length || 'distance_from_port_km' in filters) {
        return instance
      }
      return {
        ...instance,
        config: { ...instance.config, filters: { ...filters, distance_from_port_km: '3' } },
      }
    }),
  }
}

export type MapState = BaseUrlWorkspace & Record<string, unknown>

export type EncodeMapUrlInput = {
  route: MapRoute
  state?: MapState
  /** App basename prepended to `path`, defaults to '/map' */
  basename?: string
}

export type EncodeMapUrlResult = {
  /** TanStack Router navigation config to navigate from inside the map app */
  navigation: RouteNavigation & { search: MapState }
  /** Path + encoded query. External navigation = prepend origin (https://globalfishingwatch.org) */
  path: string
}

export const encodeMapUrl = ({
  route,
  state = {},
  basename = DEFAULT_BASENAME,
}: EncodeMapUrlInput): EncodeMapUrlResult => {
  const navigation = getRouteNavigation(route)
  state = withSnappedTimeRange(state)
  state = withReportContextLayers(state, route)
  state = withAisDefaultFilters(state)
  if (state.dataviewInstances) {
    state = {
      ...state,
      dataviewInstances: state.dataviewInstances.map(withDataviewId),
    }
  }
  const query = stringifyWorkspace(state)
  const path = `${basename}${buildRoutePath(navigation)}${query ? `?${query}` : ''}`
  return {
    navigation: { ...navigation, search: state },
    path,
  }
}
