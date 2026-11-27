import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import type { useStore as useJotaiStore } from 'jotai'

import {
  ASSISTANT_CONTEXT_TOOLS,
  type AssistantContextToolName,
  type AssistantContextToolResult,
} from '@globalfishingwatch/skills/context-tools'

import { ASSISTANT_CONTEXTS } from 'features/assistant/assistant-context.config'
import type { AppStore } from 'store'
import type { QueryParams } from 'types'

/**
 * Context tools: the agent calls them when it needs to know what the page shows, and the browser
 * answers from its stores (useAssistantSession onToolCall). Names and descriptions live in
 * @globalfishingwatch/skills/context-tools, shared with gfw-agent.
 */
export const isAssistantContextTool = (name: string): name is AssistantContextToolName =>
  Object.hasOwn(ASSISTANT_CONTEXT_TOOLS, name)

/** Sent with every request. The page itself is read only when the agent calls a context tool */
export type AssistantRequestContext = {
  url: string
  /** The context tools with data on this page: they also tell the agent which page it is */
  contextTools: AssistantContextToolName[]
}

export type AssistantContextDeps = {
  reduxStore: AppStore
  jotaiStore: ReturnType<typeof useJotaiStore>
}

/**
 * Returns the output gfw-agent expects for that tool (`AssistantContextToolOutputs` in the skills
 * lib). undefined → `{ available: false }`
 */
export type AssistantContextTool<Name extends AssistantContextToolName> = (
  deps: AssistantContextDeps,
  match: AssistantPageMatch
) =>
  | AssistantContextToolResult<Name>
  | undefined
  | Promise<AssistantContextToolResult<Name> | undefined>

/** What a module in assistant-context.config exports */
export type AssistantContextModule = {
  /** Read when the agent calls the tool. Never fetch: return what the page shows */
  tools: { [Name in AssistantContextToolName]?: AssistantContextTool<Name> }
  /** State the router search does not drive, applied after the navigate tool navigates */
  onNavigate?: (search: QueryParams, deps: AssistantContextDeps) => void
}

export type AssistantRouteId = RouteIds<RegisteredRouter['routeTree']>

/** The router match of the route the context is registered on */
export type AssistantPageMatch = {
  routeId: string
  params: Record<string, unknown>
  search?: object
  loaderData?: unknown
}
type RouteMatches = AssistantPageMatch[]

type LoadedContext = { module: AssistantContextModule; match: AssistantPageMatch }

/**
 * Every matched route with an entry, parent first: a vessel profile gets the map tools of the
 * map layout and its own. A module that fails to load is left out.
 */
function loadPageContexts(matches: RouteMatches): Promise<LoadedContext[]> {
  return Promise.all(
    matches.flatMap((match) => {
      const load = ASSISTANT_CONTEXTS[match.routeId as AssistantRouteId]
      return load ? [load().then((module) => ({ module, match }), warn)] : []
    })
  ).then((contexts) => contexts.filter((context) => context !== undefined))
}

/** A context that fails to load or to run is left out: it must not break the chat */
function warn(e: unknown) {
  console.warn('assistant: the page context failed', e)
  return undefined
}

export async function getAssistantRequestContext(
  matches: RouteMatches
): Promise<AssistantRequestContext> {
  const contexts = await loadPageContexts(matches)
  return {
    url: window.location.href,
    contextTools: contexts
      .flatMap(({ module }) => Object.keys(module.tools))
      .filter(isAssistantContextTool),
  }
}

/** Answers a context tool call from the page the user is on now */
export async function runAssistantContextTool(
  name: AssistantContextToolName,
  matches: RouteMatches,
  deps: AssistantContextDeps
): Promise<AssistantContextToolResult<AssistantContextToolName>> {
  const contexts = await loadPageContexts(matches)
  const context = contexts.find(({ module }) => module.tools[name])
  if (!context) {
    return { available: false }
  }
  return (await context.module.tools[name]!(deps, context.match)) ?? { available: false }
}

export async function applyAssistantNavigate(
  matches: RouteMatches,
  search: QueryParams,
  deps: AssistantContextDeps
) {
  const contexts = await loadPageContexts(matches)
  const context = contexts.find(({ module }) => module.onNavigate)
  try {
    await context?.module.onNavigate?.(search, deps)
  } catch (e) {
    warn(e)
  }
}
