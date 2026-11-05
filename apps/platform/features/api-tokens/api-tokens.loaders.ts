import { createIsomorphicFn } from '@tanstack/react-start'

import { GFWAPI, GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import type { APIPagination, UserApplication } from '@globalfishingwatch/api-types'

import { selectUserData } from 'features/_user/selectors/user.selectors'
import type { AppRouterContext } from 'router/app-router-context'
import { getAppRouterStore } from 'router/app-router-context'
import { resolveUserStateFromRequest } from 'server/user.server'

const getLoaderUser = createIsomorphicFn()
  .server(async (_context?: unknown) => (await resolveUserStateFromRequest()).user)
  .client(async (context?: unknown) => {
    const store = getAppRouterStore(context as AppRouterContext)
    return store ? selectUserData(store.getState()) : null
  })

/**
 * GFWAPI uses the session token on both sides: the request cookie on the server
 * (`server/gfw-api.server.ts`), the browser's own token on the client. `null` when the fetch fails.
 */
export const loadApiTokens = async (context: unknown): Promise<UserApplication[] | null> => {
  const user = await getLoaderUser(context)
  // The gate renders the login prompt
  if (!user?.id || user.type === GUEST_USER_TYPE) {
    return []
  }
  try {
    const { entries } = await GFWAPI.fetch<APIPagination<UserApplication>>(
      `/auth/user-applications?user-id=${user.id}`
    )
    // Newest first; createdAt is ISO 8601 so string order is date order
    return entries.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return null
  }
}
