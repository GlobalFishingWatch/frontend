import { PATH_BASENAME } from 'data/config'
import type { RoutePathValues } from 'routes/routes.utils'
import type { QueryParams } from 'types'

import { router } from './router'
import type { NavigationState } from './router-sync'

/** Replace all query params with an empty search (clears the URL search). */
export function cleanQueryParams() {
  const lastMatch = router.state.matches[router.state.matches.length - 1]
  router.navigate({
    to: lastMatch.routeId as RoutePathValues,
    params: lastMatch.params,
    replace: true,
    resetScroll: false,
    search: {},
  })
}

/**
 * Merge search params into the current URL using replace (no history entry).
 * The router-sync subscription will sync the result back to Redux state.location.
 */
export function replaceQueryParams(
  search: Partial<QueryParams>,
  { skipHistoryNavigation = true } = {}
) {
  const navState: NavigationState = { skipHistoryNavigation }
  const lastMatch = router.state.matches[router.state.matches.length - 1]
  router.navigate({
    to: lastMatch.routeId as RoutePathValues,
    params: lastMatch.params,
    replace: true,
    resetScroll: false,
    search: (prev) => ({ ...prev, ...search }),
    state: (prev) => ({ ...prev, ...navState }),
  })
}

/**
 * Get the current full URL from the router state.
 * Use this instead of window.location.href to stay consistent with router state.
 */
export function getCurrentAppUrl(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.location.origin + PATH_BASENAME + (router.state.location.href || '')
}
