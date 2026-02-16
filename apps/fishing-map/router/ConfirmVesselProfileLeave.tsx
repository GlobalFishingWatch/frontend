import { useSelector } from 'react-redux'
import { useBlocker, useRouter } from '@tanstack/react-router'

import { selectVesselProfileDataviewIntance } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectHasVesselProfileInstancePinned } from 'features/dataviews/selectors/dataviews.selectors'
import { t } from 'features/i18n/i18n'

import { ALL_WORKSPACE_ROUTES, VESSEL_ROUTES } from './routes'
import { selectIsAnyVesselLocation } from './routes.selectors'
import { mapRouteIdToType, type RoutePathValues } from './routes.utils'

function stripAppPrefix(routeId: string): string {
  return routeId.replace(/^\/_app/, '') || '/'
}

/**
 * Blocks navigation away from vessel profile when the vessel dataview instance
 * is not pinned. Prompts the user with window.confirm and, if they confirm,
 * navigates to the target route with the cleaned vessel dataview instance
 * merged into search params. We perform a single programmatic navigation
 * instead of allowing the original + replaceQueryParams to avoid a race.
 */
export function ConfirmVesselProfileLeave() {
  const router = useRouter()
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const vesselProfileDataviewInstance = useSelector(selectVesselProfileDataviewIntance)
  const hasVesselProfileInstancePinned = useSelector(selectHasVesselProfileInstancePinned)

  const enabled =
    isAnyVesselLocation && !!vesselProfileDataviewInstance && !hasVesselProfileInstancePinned

  useBlocker({
    shouldBlockFn: ({ current, next }) => {
      const nextRouteType = mapRouteIdToType(next.routeId)
      const currentRouteType = mapRouteIdToType(current.routeId)

      // Only block when navigating to a workspace route
      if (!ALL_WORKSPACE_ROUTES.includes(nextRouteType)) {
        return false
      }

      // Don't block same-route navigation unless it's a different vessel
      const isSameRouteType = nextRouteType === currentRouteType
      const isDifferentVessel =
        VESSEL_ROUTES.includes(nextRouteType) &&
        VESSEL_ROUTES.includes(currentRouteType) &&
        (next.params as any)?.vesselId !== (current.params as any)?.vesselId
      if (isSameRouteType && !isDifferentVessel) {
        return false
      }

      const shouldLeave = window.confirm(t((t) => t.vessel.confirmationClose))

      if (shouldLeave) {
        const cleanVesselDataviewInstance = {
          ...vesselProfileDataviewInstance,
          config: {
            ...vesselProfileDataviewInstance?.config,
            highlightEventStartTime: undefined,
            highlightEventEndTime: undefined,
          },
          datasetsConfig: undefined,
        }
        const nextSearch = next.search || {}
        const mergedDataviewInstances = [
          ...((nextSearch.dataviewInstances as any[]) || []),
          cleanVesselDataviewInstance,
        ]
        router.navigate({
          to: stripAppPrefix(next.routeId) as RoutePathValues,
          params: next.params,
          search: { ...nextSearch, dataviewInstances: mergedDataviewInstances },
          replace: true,
          resetScroll: false,
        })
        return true // block the original navigation; our navigate handles it
      }

      return true // block navigation
    },
    disabled: !enabled,
  })

  return null
}
