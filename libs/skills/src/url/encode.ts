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
  if (instance?.id?.includes('__')) {
    const { dataviewId } = getLayerInfo(instance.id)
    if (dataviewId) {
      return { ...instance, dataviewId }
    }
  }
  return instance
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
