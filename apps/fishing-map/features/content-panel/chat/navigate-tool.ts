import { useCallback } from 'react'
import type { RoutePathValues } from '@fishing-map/config/routes'
import { ROUTE_PATHS } from '@fishing-map/config/routes'
import { useSetAtom } from 'jotai'
import { z } from 'zod'

import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { timerangeState } from 'features/timebar/timebar.hooks'
import type { QueryParams } from 'types'

const allowedTos = new Set<string>(Object.values(ROUTE_PATHS))

/** Client-side validation for the agent's `navigate` tool input. */
export const navigateToolInputSchema = z.object({
  navigation: z.object({
    to: z
      .string()
      .refine((to): to is RoutePathValues => allowedTos.has(to), {
        message: 'Unknown route path',
      }),
    params: z.record(z.string(), z.unknown()).optional(),
    search: z.record(z.string(), z.unknown()).optional(),
  }),
  path: z.string().optional(),
})

export type NavigateToolInput = z.infer<typeof navigateToolInputSchema>
export type NavigateToolNavigation = NavigateToolInput['navigation']

export function getNavigateToolLinkProps(navigation: NavigateToolNavigation) {
  return {
    to: navigation.to,
    params: navigation.params ?? {},
    search: { ...navigation.search, sidePanelContent: 'chat' },
  }
}

/** Map state the router search params don't drive on their own. */
export function useApplyNavigateToolMapState() {
  const setTimerange = useSetAtom(timerangeState)
  const setMapViewState = useSetMapCoordinates()
  return useCallback(
    (search: NavigateToolNavigation['search']) => {
      const { start, end, latitude, longitude, zoom } = (search ?? {}) as QueryParams
      if (start && end) {
        setTimerange({ start, end })
      }
      if (latitude || longitude || zoom) {
        setMapViewState({ latitude, longitude, zoom })
      }
    },
    [setTimerange, setMapViewState]
  )
}
