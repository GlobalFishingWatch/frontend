import { PATH_BASENAME } from 'data/config'
import type { QueryParams } from 'types'

import { getRouterRef } from './router-ref'
import type { NavigationState } from './router-sync'

/**
 * Replace all query params with an empty search (clears the URL search).
 */
export function cleanQueryParams() {
  getRouterRef().navigate({
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
  getRouterRef().navigate({
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
  const href = getRouterRef().state.location?.href ?? ''
  return href.startsWith(PATH_BASENAME)
    ? window.location.origin + href
    : window.location.origin + PATH_BASENAME + (href || '/')
}
