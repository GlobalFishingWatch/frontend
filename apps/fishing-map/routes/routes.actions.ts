import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { DEFAULT_CALLBACK_URL_PARAM } from '@globalfishingwatch/react-hooks'

import { PATH_BASENAME } from 'data/config'
import { REPLACE_URL_PARAMS } from 'routes/routes.config'
import type { QueryParam, QueryParams } from 'types'

import { router } from './router'
import type { NavigationState } from './router-sync'
import type { ROUTE_TYPES } from './routes'
import { buildPathForRouteType } from './routes.utils'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES
  query?: QueryParams
  isHistoryNavigation?: boolean
  skipHistoryNavigation?: boolean
  replaceQuery?: boolean
  replaceUrl?: boolean
  payload?: Record<string, string | undefined>
}

type UpdateLocationOptions = Pick<
  UpdateQueryParamsAction,
  | 'query'
  | 'payload'
  | 'replaceQuery'
  | 'replaceUrl'
  | 'isHistoryNavigation'
  | 'skipHistoryNavigation'
>

/**
 * Transient auth params that should never persist in the URL.
 * They are read from `window.location.search` on mount (before any router navigation)
 * by `useReplaceLoginUrl`, so stripping them here is safe.
 */
const TRANSIENT_PARAMS = [ACCESS_TOKEN_STRING, DEFAULT_CALLBACK_URL_PARAM] as const

/**
 * Merge new query params with previous search, stripping transient auth params.
 * Extracted so it can be used inside TanStack Router's `search` callback.
 */
function mergeSearch(
  prev: Record<string, unknown>,
  query: QueryParams,
  replaceQuery: boolean
): Record<string, unknown> {
  const merged = replaceQuery
    ? ({ ...query } as Record<string, unknown>)
    : ({ ...prev, ...query } as Record<string, unknown>)

  // Always strip transient auth params — they are never part of workspace state
  for (const param of TRANSIENT_PARAMS) {
    delete merged[param]
  }
  return merged
}

/**
 * Navigate to a route using TanStack Router.
 * Handles query merging, replace-vs-push logic, and path interpolation from route type + payload.
 * Used by useLocationConnect hook and functions that need programmatic navigation.
 */
export function updateLocation(
  type: ROUTE_TYPES,
  {
    query = {},
    payload = {},
    replaceQuery = false,
    replaceUrl = false,
    isHistoryNavigation = false,
    skipHistoryNavigation = false,
  } = {} as UpdateLocationOptions
) {
  const shouldReplace =
    replaceUrl ||
    Object.keys((router.state.location.search || {}) as Record<string, unknown>)
      .filter((k) => (query as Record<string, unknown>)?.[k])
      .some((key) => REPLACE_URL_PARAMS.includes(key as QueryParam))

  // Build the path from route type and payload
  const path = buildPathForRouteType(type, payload)

  // Navigation state passed via history state
  const navState: NavigationState = {
    isHistoryNavigation,
    skipHistoryNavigation,
  }

  router.navigate({
    to: path,
    search: (prev) => mergeSearch(prev, query as QueryParams, replaceQuery),
    replace: shouldReplace,
    state: (prev) => ({ ...prev, ...navState }),
    resetScroll: false,
  })
}

/** Replace all query params with an empty search (clears the URL search). */
export function cleanQueryParams() {
  router.navigate({
    to: router.state.location.pathname,
    search: {},
    replace: true,
    resetScroll: false,
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
  router.navigate({
    to: router.state.location.pathname,
    search: (prev) => ({ ...prev, ...search }),
    replace: true,
    state: (prev) => ({ ...prev, ...navState }),
    resetScroll: false,
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
