import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import type { useStore as useJotaiStore } from 'jotai'

import type { MapAssistantContext } from 'features/_map/assistant/map-assistant-context'
import { ASSISTANT_CONTEXTS } from 'features/assistant/assistant-context.config'
import type { AppStore } from 'store'
import type { QueryParams } from 'types'

/**
 * The /chat body `requestContext`. gfw-agent reads these keys by name
 * (src/mastra/workspace-context.ts): rename one only together with the agent.
 */
export type AssistantRequestContext = { url: string } & Partial<MapAssistantContext>

export type AssistantContextDeps = {
  reduxStore: AppStore
  jotaiStore: ReturnType<typeof useJotaiStore>
}

/** What a module in assistant-context.config exports */
export type AssistantContextModule = {
  /** Read when a message is sent and merged into the request context */
  getContext: (
    deps: AssistantContextDeps
  ) => Promise<Partial<Omit<AssistantRequestContext, 'url'>> | undefined>
  /** State the router search does not drive, applied after the navigate tool navigates */
  onNavigate?: (search: QueryParams, deps: AssistantContextDeps) => void
}

export type AssistantContextEntry = {
  /** Applies while this route, or any route under it, is matched */
  routeId: RouteIds<RegisteredRouter['routeTree']>
  load: () => Promise<AssistantContextModule>
}

type RouteMatches = { routeId: string }[]

/**
 * Runs on the config entries of the matched routes. One that fails to load or to run is left
 * out: it must not block the message.
 */
async function forEachContext<T>(
  matches: RouteMatches,
  run: (module: AssistantContextModule) => T | Promise<T>
) {
  const routeIds = new Set(matches.map((match) => match.routeId))
  return Promise.all(
    ASSISTANT_CONTEXTS.filter((entry) => routeIds.has(entry.routeId)).map((entry) =>
      entry
        .load()
        .then(run)
        .catch((e) => {
          console.warn('assistant: a page context failed', entry.routeId, e)
          return undefined
        })
    )
  )
}

export async function getAssistantRequestContext(
  matches: RouteMatches,
  deps: AssistantContextDeps
): Promise<AssistantRequestContext> {
  const contexts = await forEachContext(matches, (module) => module.getContext(deps))
  // url last: no context can override it
  return Object.assign({}, ...contexts, { url: window.location.href })
}

export async function applyAssistantNavigate(
  matches: RouteMatches,
  search: QueryParams,
  deps: AssistantContextDeps
) {
  await forEachContext(matches, (module) => module.onNavigate?.(search, deps))
}
