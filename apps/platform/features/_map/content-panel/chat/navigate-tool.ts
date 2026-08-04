import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { z } from 'zod'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'
import type { RoutePathValues } from '@platform/config/routes'
import { ROUTE_PATHS } from '@platform/config/routes'

import { useSetMapCoordinates } from 'features/_map/map/map-viewport.hooks'
import { timerangeState } from 'features/_map/timebar/timebar.hooks'
import { setHasChangedSettings } from 'features/_map/timebar/timebar.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import type { QueryParams } from 'types'

const allowedTos = new Set<string>(Object.values(ROUTE_PATHS))

/** Client-side validation for the agent's `navigate` tool input. */
export const navigateToolInputSchema = z.object({
  navigation: z.object({
    to: z.string().refine((to): to is RoutePathValues => allowedTos.has(to), {
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
  const search = { ...navigation.search, sidePanelContent: 'chat' }
  const normalizedSearch = parseWorkspace(stringifyWorkspace(search as QueryParams)) as Record<
    string,
    unknown
  >
  delete normalizedSearch.tk
  return {
    to: navigation.to,
    params: navigation.params ?? {},
    search: normalizedSearch,
  }
}

/** Map state the router search params don't drive on their own. */
export function useNavigateToolMapState() {
  const dispatch = useAppDispatch()
  const setTimerange = useSetAtom(timerangeState)
  const setMapViewState = useSetMapCoordinates()

  const markExplicitSettings = useCallback(
    (search: NavigateToolNavigation['search']) => {
      const { timebarVisualisation } = (search ?? {}) as QueryParams
      if (timebarVisualisation) {
        dispatch(setHasChangedSettings())
      }
    },
    [dispatch]
  )

  const applyNavigateMapState = useCallback(
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

  return { markExplicitSettings, applyNavigateMapState }
}
