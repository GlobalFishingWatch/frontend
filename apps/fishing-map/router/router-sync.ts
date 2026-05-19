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
 * Also handles workspace history tracking
 *
 * Two subscribers:
 *  - onBeforeNavigate: location sync + history tracking, runs before the new
 *    route renders so layout components never see a stale location state.
 *  - onResolved: single cleanup — clears the isHistoryNavigation flag from the
 *    committed history entry (requires the entry to exist in browser history first).
 */
export function setupRouterSync(router: AnyRouter, store: AppStore) {
  const basenameRegex = new RegExp(`^${PATH_BASENAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)

  // Sync the initial route to Redux immediately — onBeforeNavigate only fires
  // for navigations that happen after this setup runs (inside a useEffect).
  const pathname = router.latestLocation.pathname.replace(basenameRegex, '') || '/'
  const initialMatches = router.matchRoutes(pathname, router.latestLocation.search)
  const initialMatch = initialMatches[initialMatches.length - 1]
  if (initialMatch) {
    const routeType = mapRouteIdToType(initialMatch.routeId)
    const params = initialMatch.params as unknown as LinkToPayload
    const search = router.latestLocation.search as unknown as QueryParams
    store.dispatch(
      setLocation({
        type: routeType,
        payload: params,
        query: search,
        pathname: router.latestLocation.pathname,
        to: normalizeRouteId(initialMatch.routeId),
      })
    )
  }

  // Deduplicate rapid-fire events for the same URL (viewport rAF, timebar rAF, etc.)
  let lastDispatchedHref = router.latestLocation.href

  // onBeforeNavigate: location sync + history tracking.
  // Runs before TanStack Router renders the new route, so layout components
  // uses the new location state and avoids intermediate UI flash.
  router.subscribe('onBeforeNavigate', (event: RouterEvents['onBeforeNavigate']) => {
    const { toLocation } = event

    if (toLocation.href === lastDispatchedHref) return
    lastDispatchedHref = toLocation.href

    const toPathname = toLocation.pathname.replace(basenameRegex, '') || '/'
    const toMatches = router.matchRoutes(toPathname, toLocation.search)
    const toMatch = toMatches[toMatches.length - 1]
    if (!toMatch) {
      return
    }

    const routeType = mapRouteIdToType(toMatch.routeId)
    const params = toMatch.params as unknown as LinkToPayload
    const search = toLocation.search as unknown as QueryParams
    const navState = (toLocation.state || {}) as NavigationState
    const state = store.getState()
    const prevLocation = state.location

    // --- Workspace history tracking ---
    const isNotInitialLoad = prevLocation.type && routeType !== prevLocation.type
    if (isNotInitialLoad) {
      const isHistoryNavigation = navState.isHistoryNavigation ?? false
      const allHistoryNavigation = state.workspace?.historyNavigation || []
      const currentHistoryNavigation = isHistoryNavigation
        ? allHistoryNavigation.slice(0, -1)
        : allHistoryNavigation
      const lastHistoryNavigation = allHistoryNavigation[allHistoryNavigation.length - 1]
      const isDifferentRoute =
        routeType !== prevLocation.type ||
        Object.entries(params).some(([key, value]) => value !== prevLocation.payload?.[key])
      const prevQuery = prevLocation.query || ({} as QueryParams)
      const isDifferentTrackCorrection = search?.trackCorrectionId && !prevQuery?.trackCorrectionId

      if (
        (isDifferentRoute || isDifferentTrackCorrection) &&
        !isHistoryNavigation &&
        (!lastHistoryNavigation || lastHistoryNavigation.pathname !== prevLocation.pathname)
      ) {
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
        const updatedHistoryNavigation = currentHistoryNavigation.map(
          (navigation: LastWorkspaceVisited) => {
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

    store.dispatch(
      setLocation({
        type: routeType,
        payload: params,
        query: search,
        pathname: toLocation.pathname,
        to: normalizeRouteId(toMatch.routeId),
        prev: prevLocation.type
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

  // onResolved: only clear the isHistoryNavigation flag from the committed history.
  router.subscribe('onResolved', (event: RouterEvents['onResolved']) => {
    const navState = (event.toLocation.state || {}) as NavigationState
    if (navState.isHistoryNavigation) {
      router.history.replace(event.toLocation.href, {
        ...event.toLocation.state,
        isHistoryNavigation: undefined,
      })
    }
  })
}
