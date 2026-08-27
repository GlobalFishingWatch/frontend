import type { AnyRouter, RouterEvents } from '@tanstack/react-router'

import { PATH_BASENAME } from 'data/map/config'
import type { LastWorkspaceVisited } from 'features/_map/workspace/workspace.slice'
import { setWorkspaceHistoryNavigation } from 'features/_map/workspace/workspace.slice'
import type { LinkToPayload } from 'router/routes.types'
import type { AppStore } from 'store'
import type { QueryParams } from 'types'

import { setLocation } from './location.slice'
import { PAGE_TURN_ROUTES, REPORT_ROUTES, WORKSPACE_ROUTES } from './routes'
import type { RoutePathValues } from './routes.utils'
import { mapRoutePathToType, normalizeRoutePath, ROUTE_PATHS } from './routes.utils'

export interface NavigationState {
  isHistoryNavigation?: boolean
}

/**
 * A match's `fullPath` as a RoutePathValues, for Redux `state.location.to`.
 *
 * That value is fed straight back into `router.navigate({ to })`, so it MUST be a member of
 * ROUTE_PATHS — and the cast means a wrong value is a silent navigation failure, not a type error.
 * `fullPath` (unlike `routeId`) already excludes pathless layout segments, so only the index-route
 * trailing slash needs normalizing.
 */
function toRoutePathValue(fullPath: string): RoutePathValues {
  return normalizeRoutePath(fullPath) as RoutePathValues
}

/**
 * Sync the initial route to Redux from the router's current URL.
 *
 * MUST run synchronously during store creation (i.e. while rendering), NOT in a
 * useEffect: effects don't run during SSR, so an effect-only sync leaves the
 * server render on the default MAP location while the real URL is something else
 * (e.g. the user page). That divergence (workspace layout vs not) produces a
 * hydration mismatch. Running it synchronously makes the SSR markup and the first
 * client render both reflect the actual URL.
 */
export function syncInitialLocation(router: AnyRouter, store: AppStore) {
  const basenameRegex = new RegExp(`^${PATH_BASENAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
  const pathname = router.latestLocation.pathname.replace(basenameRegex, '') || '/'
  const initialMatches = router.matchRoutes(pathname, router.latestLocation.search)
  const initialMatch = initialMatches[initialMatches.length - 1]
  if (!initialMatch) return
  const routeType = mapRoutePathToType(initialMatch.fullPath)
  const params = initialMatch.params as unknown as LinkToPayload
  const search = router.latestLocation.search as unknown as QueryParams
  store.dispatch(
    setLocation({
      type: routeType,
      payload: params,
      query: search,
      pathname: router.latestLocation.pathname,
      to: toRoutePathValue(initialMatch.fullPath),
    })
  )
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
 *
 * The initial route is synced separately by syncInitialLocation() during store
 * creation; onBeforeNavigate only fires for navigations after this setup runs.
 */
export function setupRouterSync(router: AnyRouter, store: AppStore) {
  const basenameRegex = new RegExp(`^${PATH_BASENAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)

  // Deduplicate rapid-fire events for the same URL (viewport rAF, timebar rAF, etc.)
  let lastDispatchedHref = router.latestLocation.href

  // onBeforeNavigate: location sync + history tracking.
  // Runs before TanStack Router renders the new route, so layout components
  // uses the new location state and avoids intermediate UI flash.
  const unsubscribeBeforeNavigate = router.subscribe(
    'onBeforeNavigate',
    (event: RouterEvents['onBeforeNavigate']) => {
      const { toLocation } = event

      if (toLocation.href === lastDispatchedHref) return
      lastDispatchedHref = toLocation.href

      const toPathname = toLocation.pathname.replace(basenameRegex, '') || '/'
      const toMatches = router.matchRoutes(toPathname, toLocation.search)
      const toMatch = toMatches[toMatches.length - 1]
      if (!toMatch) {
        return
      }

      const routeType = mapRoutePathToType(toMatch.fullPath)
      const params = toMatch.params as unknown as LinkToPayload
      const search = toLocation.search as unknown as QueryParams
      const navState = (toLocation.state || {}) as NavigationState
      const state = store.getState()
      const prevLocation = state.location

      // --- Workspace history tracking ---
      const hasPreviousLocation = Boolean(prevLocation.pathname)
      if (hasPreviousLocation) {
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
        const isDifferentTrackCorrection =
          search?.trackCorrectionId && !prevQuery?.trackCorrectionId
        const isPageTurn = routeType === prevLocation.type && PAGE_TURN_ROUTES.includes(routeType)

        if (
          !isHistoryNavigation &&
          !isPageTurn &&
          (isDifferentRoute || isDifferentTrackCorrection) &&
          (!lastHistoryNavigation || lastHistoryNavigation.pathname !== prevLocation.pathname)
        ) {
          const newHistoryNavigation: LastWorkspaceVisited = {
            pathname: prevLocation.pathname,
            to: prevLocation.to || ROUTE_PATHS.MAP,
            params: prevLocation.payload,
            search: { ...(prevQuery as QueryParams) } as QueryParams,
          }
          store.dispatch(
            setWorkspaceHistoryNavigation([...currentHistoryNavigation, newHistoryNavigation])
          )
        } else if (lastHistoryNavigation) {
          const updatedHistoryNavigation = currentHistoryNavigation.map(
            (navigation: LastWorkspaceVisited) => {
              const navRouteType = mapRoutePathToType(lastHistoryNavigation.to)
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
          to: toRoutePathValue(toMatch.fullPath),
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
    }
  )

  // onResolved: only clear the isHistoryNavigation flag from the committed history.
  // Scroll reset is the router's job — `scrollToTopSelectors` in router.tsx.
  const unsubscribeResolved = router.subscribe(
    'onResolved',
    (event: RouterEvents['onResolved']) => {
      const navState = (event.toLocation.state || {}) as NavigationState

      if (navState.isHistoryNavigation) {
        router.navigate({
          replace: true,
          resetScroll: false,
          search: true,
          state: (state) => ({ ...state, isHistoryNavigation: undefined }),
        })
      }
    }
  )

  // Teardown — callers MUST invoke this on unmount to avoid stacking duplicate
  // subscribers on the long-lived router singleton (memory leak / OOM).
  return () => {
    unsubscribeBeforeNavigate()
    unsubscribeResolved()
  }
}
