import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { resolveDataviewSlug } from './config'
import type { MapRoute, RouteNavigation } from './routes'
import { buildRoutePath, DEFAULT_BASENAME, getRouteNavigation } from './routes'

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
      dataviewInstances: state.dataviewInstances.map((instance: any) =>
        instance?.dataviewId
          ? { ...instance, dataviewId: resolveDataviewSlug(String(instance.dataviewId)) }
          : instance
      ),
    }
  }
  const query = stringifyWorkspace(state)
  const path = `${basename}${buildRoutePath(navigation)}${query ? `?${query}` : ''}`
  return {
    navigation: { ...navigation, search: state },
    path,
  }
}
