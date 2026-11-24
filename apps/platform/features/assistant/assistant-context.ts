import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import type { useStore as useJotaiStore } from 'jotai'

import type { MapAssistantContext } from 'features/_map/assistant/map-assistant-context'
import type { PlacesAssistantContext } from 'features/_places/assistant/places-assistant-context'
import type { VesselSearchAssistantContext } from 'features/_vessels/search/assistant/vessel-search-assistant-context'
import { ASSISTANT_CONTEXTS } from 'features/assistant/assistant-context.config'
import type { HelpAssistantContext } from 'features/help/assistant/help-assistant-context'
import type { AppStore } from 'store'
import type { QueryParams } from 'types'

/** Content pages send what they show as `page`; the map routes send `workspace` and `mapView` */
export type AssistantRequestContext = { url: string } & Partial<MapAssistantContext> & {
    page?: (PlacesAssistantContext | VesselSearchAssistantContext | HelpAssistantContext)['page']
  }

export type AssistantContextDeps = {
  reduxStore: AppStore
  jotaiStore: ReturnType<typeof useJotaiStore>
}

/** What a module in assistant-context.config exports */
export type AssistantContextModule = {
  /** Read when a message is sent and added to the request context */
  getContext: (
    deps: AssistantContextDeps,
    match: AssistantPageMatch
  ) => Promise<Partial<Omit<AssistantRequestContext, 'url'>> | undefined>
  /** State the router search does not drive, applied after the navigate tool navigates */
  onNavigate?: (search: QueryParams, deps: AssistantContextDeps) => void
}

export type AssistantRouteId = RouteIds<RegisteredRouter['routeTree']>

/** The router match of the route the context is registered on */
export type AssistantPageMatch = {
  routeId: string
  params: Record<string, unknown>
  loaderData?: unknown
}
type RouteMatches = AssistantPageMatch[]

/** One context per page: the deepest matched route that has one */
function loadPageContext(matches: RouteMatches) {
  const match = matches.findLast((match) => ASSISTANT_CONTEXTS[match.routeId as AssistantRouteId])
  const load = match && ASSISTANT_CONTEXTS[match.routeId as AssistantRouteId]
  return load ? load().then((module) => ({ module, match })) : Promise.resolve(undefined)
}

/** A page context that fails to load or to run is left out: it must not block the message */
function warn(e: unknown) {
  console.warn('assistant: the page context failed', e)
  return undefined
}

export async function getAssistantRequestContext(
  matches: RouteMatches,
  deps: AssistantContextDeps
): Promise<AssistantRequestContext> {
  const context = await loadPageContext(matches)
    .then((page) => page?.module.getContext(deps, page.match))
    .catch(warn)
  // url last: the context cannot override it
  return { ...context, url: window.location.href }
}

export async function applyAssistantNavigate(
  matches: RouteMatches,
  search: QueryParams,
  deps: AssistantContextDeps
) {
  await loadPageContext(matches)
    .then((page) => page?.module.onNavigate?.(search, deps))
    .catch(warn)
}
