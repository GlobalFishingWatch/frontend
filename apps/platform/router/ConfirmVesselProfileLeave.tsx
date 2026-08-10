import { useSelector } from 'react-redux'
import { useBlocker, useRouter } from '@tanstack/react-router'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { selectVesselProfileDataviewIntance } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { selectHasVesselProfileInstancePinned } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { cleanVesselProfileDataviewInstances } from 'features/_map/sidebar/sidebar-header.hooks'
import { t } from 'features/i18n/i18n'
import type { QueryParams } from 'types'

import { ALL_WORKSPACE_ROUTES, VESSEL_ROUTES } from './routes'
import { selectIsAnyVesselLocation } from './routes.selectors'
import { mapRoutePathToType, normalizeRoutePath, type RoutePathValues } from './routes.utils'

/**
 * Blocks navigation away from vessel profile when the vessel dataview instance is not pinned.
 * Prompts: OK keeps the vessel in the workspace, Cancel exits and removes it.
 * Both choices leave the profile via a deferred navigate
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
      const nextRouteType = mapRoutePathToType(next.fullPath)
      const currentRouteType = mapRoutePathToType(current.fullPath)

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

      const keepVessel = window.confirm(t((t) => t.vessel.confirmationClose))

      const vesselId = vesselProfileDataviewInstance!.id
      const nextSearch = (next.search || {}) as QueryParams
      const otherDataviewInstances = (nextSearch.dataviewInstances || []).filter(
        (dataviewInstance) => dataviewInstance.id !== vesselId
      )

      let dataviewInstances = cleanVesselProfileDataviewInstances(otherDataviewInstances)
      if (keepVessel) {
        const cleanVesselDataviewInstance: UrlDataviewInstance = {
          ...vesselProfileDataviewInstance!,
          config: {
            ...vesselProfileDataviewInstance!.config,
            highlightEventStartTime: undefined,
            highlightEventEndTime: undefined,
          },
          datasetsConfig: undefined,
        }
        dataviewInstances = cleanVesselProfileDataviewInstances([
          ...otherDataviewInstances,
          cleanVesselDataviewInstance,
        ])
      }

      setTimeout(() => {
        router.navigate({
          to: normalizeRoutePath(next.fullPath) as RoutePathValues,
          params: next.params,
          state: (state) => ({ ...state, isHistoryNavigation: true }),
          search: { ...nextSearch, dataviewInstances },
          replace: true,
          resetScroll: false,
          ignoreBlocker: true,
        })
      })
      return true // block the original navigation; deferred navigate handles it
    },
    disabled: !enabled,
    enableBeforeUnload: false,
  })

  return null
}
