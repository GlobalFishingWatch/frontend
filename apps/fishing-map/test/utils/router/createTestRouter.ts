import type { Router } from '@tanstack/react-router'
import { createMemoryHistory, createRouter } from '@tanstack/react-router'

import { PATH_BASENAME } from 'data/config'
import { getCreateRouterOptions } from 'router'
import type { QueryParams } from 'types'

/**
 * TanStack Router test harness for fishing-map.
 *
 * Reference: https://tanstack.com/router/latest/docs/how-to/test-file-based-routing
 *
 * Production calls `createAppRouter()`; tests call `createTestRouter(initialHref)` and
 * use `createMemoryHistory` so URLs are deterministic and isolated per test.
 * Both share `getCreateRouterOptions()` (routeTree, basepath, parse/stringify search,
 * default components) so search serialization stays identical.
 */
export interface CreateTestRouterOptions {
  /**
   * Initial URL the memory history should start at. Pathname is relative to the
   * router `basepath` (PATH_BASENAME). Leading basepath is allowed and stripped
   * to match how the browser pathname relates to router state in production.
   *
   * @default '/'
   */
  initialHref?: string
}

/**
 * Build a memory history entry from a router-relative pathname + optional search.
 * Strips PATH_BASENAME from the front if present (mirrors `router-sync.ts`).
 */
function buildInitialEntry(initialHref: string, basepath: string): string {
  const escapedBase = basepath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return initialHref.replace(new RegExp(`^${escapedBase}`), '') || '/'
}

export type TestRouter = Router<ReturnType<typeof getCreateRouterOptions>['routeTree'], 'never'>

export function createTestRouter(options: CreateTestRouterOptions = {}): TestRouter {
  const { initialHref = '/' } = options

  const sharedOptions = getCreateRouterOptions()

  const memoryEntry = buildInitialEntry(initialHref, PATH_BASENAME)

  const router = createRouter({
    ...sharedOptions,
    history: createMemoryHistory({ initialEntries: [memoryEntry] }),
  })

  return router as unknown as TestRouter
}

/**
 * Convenience builder when callers have a route + search object instead of a raw href.
 * Uses the production `stringifySearch` so the URL parses identically.
 */
export function buildTestRouterHref(pathname: string, search?: QueryParams): string {
  const { stringifySearch } = getCreateRouterOptions()
  const searchString = search ? stringifySearch(search) : ''
  return `${pathname}${searchString}`
}
