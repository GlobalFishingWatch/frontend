import { LAYER_LIBRARY_ID_SEPARATOR } from '@fishing-map/config'

import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'
import { getDateInIntervalResolution } from '@globalfishingwatch/deck-layers'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

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
  const interval = getFourwingsInterval(start, end)
  return {
    ...state,
    start: new Date(getDateInIntervalResolution(start, interval)).toISOString(),
    end: new Date(getDateInIntervalResolution(end, interval)).toISOString(),
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
