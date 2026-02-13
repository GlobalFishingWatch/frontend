import type { AnyRouter, RouterEvents } from '@tanstack/react-router'

import { PATH_BASENAME } from 'data/config'
import type { LastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { setWorkspaceHistoryNavigation } from 'features/workspace/workspace.slice'
import type { LinkToPayload } from 'router/routes.types'
import type { AppStore } from 'store'
import type { QueryParams } from 'types'

import { setLocation } from './location.slice'
import { REPORT_ROUTES, WORKSPACE_ROUTES } from './routes'
import type { RoutePathValues } from './routes.utils'
import { mapRouteIdToType, ROUTE_PATHS } from './routes.utils'

export interface NavigationState {
  isHistoryNavigation?: boolean
  skipHistoryNavigation?: boolean
}

/**
 * Normalize a routeId to a RoutePathValues.
 * The workspace index route generates a trailing-slash routeId (/$category/$workspaceId/)
 * which needs to be mapped to the canonical /$category/$workspaceId for navigation.
 */
function normalizeRouteId(routeId: string): RoutePathValues {
  // Strip /_app prefix from file-based route IDs
  const stripped = routeId.replace(/^\/_app/, '') || '/'
  if (stripped === '/$category/$workspaceId/') {
    return ROUTE_PATHS.WORKSPACE
  }
  return stripped as RoutePathValues
}

/**
 * Sets up the one-way sync from TanStack Router → Redux state.location.
 * Also handles the workspace history tracking logic that was previously
 * in routerWorkspaceMiddleware.
 */
export function setupRouterSync(router: AnyRouter, store: AppStore) {
  // Sync the initial router state to Redux immediately.
  // The 'onResolved' event only fires on pending→resolved transitions,
  // which may not happen on initial load when routes have no loaders.
  // We use router.matchRoutes() because router.state.matches is still
  // empty at this point (matches are populated by router.load() later).
  // Strip basepath from pathname: with Next.js basepath /map, browser pathname
  // is /map or /map/..., while router expects paths relative to basepath.
  const pathname =
    router.latestLocation.pathname.replace(
      new RegExp(`^${PATH_BASENAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
      ''
    ) || '/'
  const initialMatches = router.matchRoutes(pathname, router.latestLocation.search)
  const initialMatch = initialMatches[initialMatches.length - 1]
  if (initialMatch) {
    const routeType = mapRouteIdToType(initialMatch.routeId)
    const params = initialMatch.params as unknown as LinkToPayload
    const search = router.latestLocation.search as unknown as QueryParams
    store.dispatch(
      setLocation({
        // Legacy format (backward compatibility)
        type: routeType,
        payload: params,
        query: search,
        pathname: router.latestLocation.pathname,
        // TanStack Router format (direct usage)
        to: normalizeRouteId(initialMatch.routeId),
      })
    )
  }

  // Track last synced href to skip redundant dispatches.
  // Multiple navigations can fire onResolved in quick succession
  // (e.g., layer toggle + viewport rAF + timebar rAF).
  let lastSyncedHref = ''

  router.subscribe('onResolved', (event: RouterEvents['onResolved']) => {
    const { toLocation, fromLocation } = event

    // Skip if the URL hasn't changed since the last sync
    if (toLocation.href === lastSyncedHref) {
      return
    }
    lastSyncedHref = toLocation.href

    const matches = router.state.matches
    const lastMatch = matches[matches.length - 1]

    if (!lastMatch) {
      return
    }

    const routeType = mapRouteIdToType(lastMatch.routeId)
    const params = lastMatch.params as unknown as LinkToPayload
    const search = toLocation.search as unknown as QueryParams
    const navState = (toLocation.state || {}) as NavigationState

    const state = store.getState()
    const prevLocation = state.location

    // --- Workspace middleware logic: history navigation tracking ---
    const isNotInitialLoad = prevLocation.type && routeType !== prevLocation.type
    if (isNotInitialLoad && !navState.skipHistoryNavigation) {
      const currentHistoryNavigation = state.workspace?.historyNavigation || []
      const lastHistoryNavigation = currentHistoryNavigation[currentHistoryNavigation.length - 1]
      const isDifferentRoute =
        routeType !== prevLocation.type ||
        Object.entries(params).some(([key, value]) => value !== prevLocation.payload?.[key])
      const prevQuery = prevLocation.query || ({} as QueryParams)
      const isDifferentTrackCorrection = search?.trackCorrectionId && !prevQuery?.trackCorrectionId

      if (
        (isDifferentRoute || isDifferentTrackCorrection) &&
        !navState.isHistoryNavigation &&
        (!lastHistoryNavigation || lastHistoryNavigation.pathname !== prevLocation.pathname)
      ) {
        // Store history in TanStack Router format - copy directly from location state
        const newHistoryNavigation: LastWorkspaceVisited = {
          pathname: prevLocation.pathname,
          to: prevLocation.to || ROUTE_PATHS.HOME,
          params: prevLocation.payload,
          search: { ...(prevQuery as QueryParams) } as QueryParams,
        }
        store.dispatch(
          setWorkspaceHistoryNavigation([...currentHistoryNavigation, newHistoryNavigation])
        )
      } else if (lastHistoryNavigation) {
        const historyNavigation = navState.isHistoryNavigation
          ? currentHistoryNavigation.slice(0, -1)
          : currentHistoryNavigation
        const updatedHistoryNavigation = historyNavigation.map(
          (navigation: LastWorkspaceVisited) => {
            // Determine route type from path pattern to check if we should update dataviewInstances
            const navRouteType = mapRouteIdToType(lastHistoryNavigation.to)
            if ([...WORKSPACE_ROUTES, ...REPORT_ROUTES].includes(navRouteType)) {
              const dataviewInstancesWithoutReport = WORKSPACE_ROUTES.includes(navRouteType)
                ? (search.dataviewInstances || []).filter(
                    (dataviewInstance) => dataviewInstance.origin !== 'report'
                  )
                : search.dataviewInstances || []
              return {
                ...navigation,
                search: {
                  ...search,
                  dataviewInstances: dataviewInstancesWithoutReport,
                },
              }
            }
            return navigation
          }
        )
        store.dispatch(setWorkspaceHistoryNavigation(updatedHistoryNavigation))
      }
    }

    // --- Sync to Redux ---
    store.dispatch(
      setLocation({
        // Legacy format (backward compatibility)
        type: routeType,
        payload: params,
        query: search,
        pathname: toLocation.pathname,
        // TanStack Router format (direct usage)
        to: normalizeRouteId(lastMatch.routeId),
        prev: fromLocation
          ? {
              type: prevLocation.type,
              payload: prevLocation.payload,
              query: prevLocation.query as QueryParams,
              pathname: prevLocation.pathname,
              to: prevLocation.to,
            }
          : undefined,
      })
    )
  })
}
