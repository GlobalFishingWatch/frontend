import type { UserData } from '@globalfishingwatch/api-types'

import { ANONYMOUS_PERMISSIONS, GUEST_USER_TYPE } from '../config'

// Static guest user from the committed anonymous permissions — no network call.
// Same shape as fetchGuestUser; use it to resolve a guest synchronously (client or SSR).
export const getGuestUser = (): UserData => ({
  id: 0,
  type: GUEST_USER_TYPE,
  permissions: ANONYMOUS_PERMISSIONS,
  groups: [],
})
