import { createIsomorphicFn } from '@tanstack/react-start'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import type { UserApplication } from '@globalfishingwatch/api-types'

import { selectUserData } from 'features/_user/selectors/user.selectors'
import type { AppRouterContext } from 'router/app-router-context'
import { getAppRouterStore } from 'router/app-router-context'
import { resolveUserStateFromRequest } from 'server/user.server'

import { getApiTokens } from './api-tokens.serverfn'

const getLoaderUser = createIsomorphicFn()
  .server(async (_context?: unknown) => (await resolveUserStateFromRequest()).user)
  .client(async (context?: unknown) => {
    const store = getAppRouterStore(context as AppRouterContext)
    return store ? selectUserData(store.getState()) : null
  })

export const loadApiTokens = async (context: unknown): Promise<UserApplication[] | null> => {
  const user = await getLoaderUser(context)
  // The gate renders the login prompt
  if (!user?.id || user.type === GUEST_USER_TYPE) {
    return []
  }
  return getApiTokens({ data: { userId: user.id } })
}
