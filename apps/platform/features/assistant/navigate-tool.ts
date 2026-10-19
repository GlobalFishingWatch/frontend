import { useCallback } from 'react'
import { deepEqual, useRouter } from '@tanstack/react-router'
import { useStore as useJotaiStore } from 'jotai'
import { z } from 'zod'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'
import type { RoutePathValues } from '@platform/config/routes'
import { ROUTE_PATHS } from '@platform/config/routes'

import { withSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { setHasChangedSettings } from 'features/_map/timebar/timebar.slice'
import { useAppDispatch, useAppStore } from 'features/app/app.hooks'
import { applyAssistantNavigate } from 'features/assistant/assistant-context'
import type { QueryParams } from 'types'

const allowedTos = new Set<string>(Object.values(ROUTE_PATHS))

const navigationSchema = z.object({
  to: z.string().refine((to): to is RoutePathValues => allowedTos.has(to), {
    message: 'Unknown route path',
  }),
  params: z.record(z.string(), z.unknown()).optional(),
  search: z.record(z.string(), z.unknown()).optional(),
})

export const navigateToolOutputSchema = z.object({
  ok: z.literal(true),
  navigation: navigationSchema,
  path: z.string().optional(),
  alternatives: z.array(z.unknown()).optional(),
})

export const navigateToolAlternativeSchema = z.object({
  label: z.string(),
  ok: z.literal(true),
  navigation: navigationSchema,
  path: z.string().optional(),
})

export type NavigateToolOutput = z.infer<typeof navigateToolOutputSchema>
export type NavigateToolNavigation = z.infer<typeof navigationSchema>

export function getNavigateToolAlternatives(output: NavigateToolOutput) {
  return (output.alternatives ?? []).flatMap((alternative) => {
    const parsed = navigateToolAlternativeSchema.safeParse(alternative)
    return parsed.success ? [parsed.data] : []
  })
}

export function getNavigateToolLinkProps(navigation: NavigateToolNavigation) {
  const normalizedSearch = parseWorkspace(
    stringifyWorkspace((navigation.search ?? {}) as QueryParams)
  ) as Record<string, unknown>
  delete normalizedSearch.tk
  // panels belong to the viewer, not to the agent's view: keep every open one and the assistant
  delete normalizedSearch.sidePanels
  delete normalizedSearch.sidePanelActive
  return {
    to: navigation.to,
    params: navigation.params ?? {},
    search: (prev: QueryParams) => ({
      ...normalizedSearch,
      ...withSidePanel(prev, { type: 'assistant' }),
    }),
    /** Target search without panels, to compare against the current location */
    viewSearch: normalizedSearch,
  }
}

type SearchRecord = Record<string, unknown>
type InstanceLike = { id?: string }

/**
 * Routes where the url viewport is what the map shows. Reports and vessel profiles fit the camera
 * to their area or track after navigating, so their url viewport never matches the agent's.
 */
const URL_VIEWPORT_ROUTES = new Set<string>([ROUTE_PATHS.MAP, ROUTE_PATHS.WORKSPACE])
/** Absorbs float noise only: one pixel of panning at zoom 4 already moves the center ~0.02° */
const VIEWPORT_TOLERANCE = { latitude: 1e-4, longitude: 1e-4, zoom: 1e-3 }

function isSameViewport(current: SearchRecord, linkSearch: SearchRecord) {
  return (Object.keys(VIEWPORT_TOLERANCE) as (keyof typeof VIEWPORT_TOLERANCE)[]).every((key) => {
    if (linkSearch[key] === undefined) return true
    const diff = Math.abs(Number(current[key]) - Number(linkSearch[key]))
    return diff <= VIEWPORT_TOLERANCE[key]
  })
}

export function isNavigateToolViewActive(
  current: SearchRecord,
  linkSearch: SearchRecord,
  to: NavigateToolNavigation['to']
) {
  const {
    latitude: _lat,
    longitude: _lng,
    zoom: _zoom,
    dataviewInstances: linkInstances,
    ...rest
  } = linkSearch
  if (!deepEqual(current, rest, true)) {
    return false
  }
  if (URL_VIEWPORT_ROUTES.has(to) && !isSameViewport(current, linkSearch)) {
    return false
  }
  if (!Array.isArray(linkInstances)) {
    return true
  }
  const currentInstances = (current.dataviewInstances ?? []) as InstanceLike[]
  return (linkInstances as InstanceLike[]).every((linkInstance) =>
    deepEqual(
      currentInstances.find((instance) => instance.id === linkInstance.id),
      linkInstance,
      true
    )
  )
}

/** State the router search params don't drive on their own. */
export function useNavigateToolState() {
  const dispatch = useAppDispatch()
  const store = useAppStore()
  const router = useRouter()
  const jotaiStore = useJotaiStore()

  // Before navigating: the timebar slice is in the eager store, and a report mounting on this
  // navigation reads the flag to decide whether to override the timebar visualisation.
  const markExplicitSettings = useCallback(
    (search: NavigateToolNavigation['search']) => {
      const { timebarVisualisation } = (search ?? {}) as QueryParams
      if (timebarVisualisation) {
        dispatch(setHasChangedSettings())
      }
    },
    [dispatch]
  )

  // Called once navigated: the routes matched now are the target's, not the ones the message
  // was sent from.
  const applyNavigatePageState = useCallback(
    (search: NavigateToolNavigation['search']) =>
      applyAssistantNavigate(router.state.matches, (search ?? {}) as QueryParams, {
        reduxStore: store,
        jotaiStore,
      }),
    [router, store, jotaiStore]
  )

  return { markExplicitSettings, applyNavigatePageState }
}
