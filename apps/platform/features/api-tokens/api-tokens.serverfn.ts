import { createServerFn } from '@tanstack/react-start'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { APIPagination, UserApplication } from '@globalfishingwatch/api-types'

/** Runs with the requesting user's token (see `server/gfw-api.server.ts`). `null` when it fails. */
export const getApiTokens = createServerFn({ method: 'GET' })
  .validator((params: { userId: number }) => {
    if (!Number.isInteger(params.userId)) {
      throw new Error('Invalid userId')
    }
    return { userId: params.userId }
  })
  .handler(async ({ data: { userId } }): Promise<UserApplication[] | null> => {
    try {
      const { entries } = await GFWAPI.fetch<APIPagination<UserApplication>>(
        `/auth/user-applications?user-id=${userId}`
      )
      // Newest first; createdAt is ISO 8601 so string order is date order
      return entries.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    } catch {
      return null
    }
  })
