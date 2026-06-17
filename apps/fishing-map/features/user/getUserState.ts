import { createServerFn } from '@tanstack/react-start'

import type { UserData } from '@globalfishingwatch/api-types'

export const getUserState = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ user: UserData | null }> => {
    const { getRequest } = await import('@tanstack/react-start/server')
    const { fetchUserFromRequest } = await import('./getUser.server')
    const request = getRequest()
    return { user: await fetchUserFromRequest(request) }
  }
)
