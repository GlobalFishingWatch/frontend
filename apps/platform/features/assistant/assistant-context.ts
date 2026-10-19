import { useEffect } from 'react'
import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import type { useStore as useJotaiStore } from 'jotai'
import { atom, useSetAtom } from 'jotai'

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

/** What a module in assistant-context.config exports, or a feature registers */
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

/**
 * Contexts of features mounted inside a page, for state that lives in their components rather
 * than in the stores. Pages go in assistant-context.config instead.
 */
export const assistantFeatureContextsAtom = atom<AssistantContextModule[]>([])

/** Keep `context` stable (module scope or useMemo): a new object re-registers it */
export function useAssistantFeatureContext(context: AssistantContextModule) {
  const setContexts = useSetAtom(assistantFeatureContextsAtom)
  useEffect(() => {
    setContexts((current) => [...current, context])
    return () => setContexts((current) => current.filter((c) => c !== context))
  }, [context, setContexts])
}

type RouteMatches = { routeId: string }[]

/**
 * Runs on the config entries of the matched routes, then on the mounted features. One that fails
 * to load or to run is left out: it must not block the message.
 */
async function forEachContext<T>(
  matches: RouteMatches,
  deps: AssistantContextDeps,
  run: (module: AssistantContextModule) => T | Promise<T>
) {
  const routeIds = new Set(matches.map((match) => match.routeId))
  const modules = [
    ...ASSISTANT_CONTEXTS.filter((entry) => routeIds.has(entry.routeId)).map((e) => e.load()),
    ...deps.jotaiStore.get(assistantFeatureContextsAtom).map((m) => Promise.resolve(m)),
  ]
  return Promise.all(
    modules.map((module) =>
      module.then(run).catch((e) => {
        console.warn('assistant: a page or feature context failed', e)
        return undefined
      })
    )
  )
}

export async function getAssistantRequestContext(
  matches: RouteMatches,
  deps: AssistantContextDeps
): Promise<AssistantRequestContext> {
  const contexts = await forEachContext(matches, deps, (module) => module.getContext(deps))
  // url last: no context can override it
  return Object.assign({}, ...contexts, { url: window.location.href })
}

export async function applyAssistantNavigate(
  matches: RouteMatches,
  search: QueryParams,
  deps: AssistantContextDeps
) {
  await forEachContext(matches, deps, (module) => module.onNavigate?.(search, deps))
}
