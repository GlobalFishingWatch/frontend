import { selectVesselProfileDataviewIntance } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectHasVesselProfileInstancePinned } from 'features/dataviews/selectors/dataviews.selectors'
import { t } from 'features/i18n/i18n'
import type { LastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { setWorkspaceHistoryNavigation } from 'features/workspace/workspace.slice'
import type { AppStore } from 'store'
import type { QueryParams } from 'types'

import { setLocation } from './location.slice'
import type { AppRouter } from './router'
import type { ROUTE_TYPES } from './routes'
import { ALL_WORKSPACE_ROUTES, REPORT_ROUTES, VESSEL_ROUTES, WORKSPACE_ROUTES } from './routes'
import { selectIsAnyVesselLocation } from './routes.selectors'
import type { LinkToPayload } from './routes.types'
import { mapRouteIdToType } from './routes.utils'

export interface NavigationState {
  isHistoryNavigation?: boolean
  skipHistoryNavigation?: boolean
}

/**
 * Sets up the one-way sync from TanStack Router → Redux state.location.
 * Also handles the workspace history tracking logic that was previously
 * in routerWorkspaceMiddleware.
 */
export function setupRouterSync(router: AppRouter, store: AppStore) {
  // Sync the initial router state to Redux immediately.
  // The 'onResolved' event only fires on pending→resolved transitions,
  // which may not happen on initial load when routes have no loaders.
  // We use router.matchRoutes() because router.state.matches is still
  // empty at this point (matches are populated by router.load() later).
  const initialMatches = router.matchRoutes(
    router.latestLocation.pathname,
    router.latestLocation.search
  )
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
      })
    )
  }

  // Track last synced href to skip redundant dispatches.
  // Multiple navigations can fire onResolved in quick succession
  // (e.g., layer toggle + viewport rAF + timebar rAF).
  let lastSyncedHref = ''

  router.subscribe('onResolved', (event) => {
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

    // --- Workspace middleware logic: vessel profile pinning ---
    let finalSearch = { ...search }
    const isAnyVesselLocation = selectIsAnyVesselLocation(state)
    const navigatesToWorkspaceRoute = ALL_WORKSPACE_ROUTES.includes(routeType)
    const vesselProfileDataviewIntance = selectVesselProfileDataviewIntance(state)
    const hasVesselProfileInstancePinned = selectHasVesselProfileInstancePinned(state)
    const navigatesToDifferentLocation = routeType !== prevLocation.type
    const navigatesToDifferentVessel =
      VESSEL_ROUTES.includes(routeType) &&
      VESSEL_ROUTES.includes(prevLocation.type as ROUTE_TYPES) &&
      params.vesselId !== prevLocation.payload?.vesselId

    if (
      isAnyVesselLocation &&
      navigatesToWorkspaceRoute &&
      (navigatesToDifferentLocation || navigatesToDifferentVessel) &&
      vesselProfileDataviewIntance &&
      !hasVesselProfileInstancePinned
    ) {
      if (window.confirm(t((t) => t.vessel.confirmationClose)) === true) {
        const cleanVesselDataviewInstance = {
          ...vesselProfileDataviewIntance,
          config: {
            ...vesselProfileDataviewIntance?.config,
            highlightEventStartTime: undefined,
            highlightEventEndTime: undefined,
          },
          datasetsConfig: undefined,
        }
        finalSearch = {
          ...finalSearch,
          dataviewInstances: [
            ...(finalSearch.dataviewInstances || []),
            cleanVesselDataviewInstance,
          ],
        }
      }
    }

    // --- Workspace middleware logic: history navigation tracking ---
    const isNotInitialLoad = prevLocation.type && routeType !== prevLocation.type
    if (isNotInitialLoad && !navState.skipHistoryNavigation) {
      const currentHistoryNavigation = state.workspace?.historyNavigation || []
      const lastHistoryNavigation = currentHistoryNavigation[currentHistoryNavigation.length - 1]
      const isDifferentRoute =
        routeType !== prevLocation.type ||
        Object.entries(params).some(([key, value]) => value !== prevLocation.payload?.[key])
      const prevQuery = prevLocation.query || ({} as QueryParams)
      const isDifferentTrackCorrection =
        finalSearch?.trackCorrectionId && !prevQuery?.trackCorrectionId

      if (
        (isDifferentRoute || isDifferentTrackCorrection) &&
        !navState.isHistoryNavigation &&
        (!lastHistoryNavigation || lastHistoryNavigation.pathname !== prevLocation.pathname)
      ) {
        const newHistoryNavigation: LastWorkspaceVisited = {
          pathname: prevLocation.pathname,
          type: prevLocation.type as ROUTE_TYPES,
          query: { ...(prevQuery as QueryParams) } as QueryParams,
          payload: prevLocation.payload as LinkToPayload,
        }
        store.dispatch(
          setWorkspaceHistoryNavigation([...currentHistoryNavigation, newHistoryNavigation])
        )
      } else if (lastHistoryNavigation) {
        const historyNavigation = navState.isHistoryNavigation
          ? currentHistoryNavigation.slice(0, -1)
          : currentHistoryNavigation
        const updatedHistoryNavigation = historyNavigation.map((navigation: LastWorkspaceVisited) => {
          if ([...WORKSPACE_ROUTES, ...REPORT_ROUTES].includes(lastHistoryNavigation.type)) {
            const dataviewInstancesWithoutReport = WORKSPACE_ROUTES.includes(
              lastHistoryNavigation.type
            )
              ? (finalSearch.dataviewInstances || []).filter(
                  (dataviewInstance) => dataviewInstance.origin !== 'report'
                )
              : finalSearch.dataviewInstances || []
            return {
              ...navigation,
              query: {
                ...finalSearch,
                dataviewInstances: dataviewInstancesWithoutReport,
              },
            }
          }
          return navigation
        })
        store.dispatch(setWorkspaceHistoryNavigation(updatedHistoryNavigation))
      }
    }

    // --- Sync to Redux ---
    store.dispatch(
      setLocation({
        type: routeType,
        payload: params,
        query: finalSearch,
        pathname: toLocation.pathname,
        prev: fromLocation
          ? {
              type: prevLocation.type,
              payload: prevLocation.payload,
              query: prevLocation.query as QueryParams,
              pathname: prevLocation.pathname,
            }
          : undefined,
      })
    )
  })
}
