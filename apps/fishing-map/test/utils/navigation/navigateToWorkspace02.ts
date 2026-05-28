import { ROUTE_PATHS } from 'router/routes.utils'
import { UserTab } from 'types'

import type { NavigationConfig } from './navigation-config'

export function navigateToWorkspace02(): NavigationConfig<typeof ROUTE_PATHS.WORKSPACE> {
  return {
    to: ROUTE_PATHS.WORKSPACE,
    params: {
      category: 'fishing-activity',
      workspaceId: 'workspace_02-user-public',
    },
    search: {
      latitude: -48.57949801790946,
      longitude: -43.777381703360966,
      zoom: 1.8027528200145846,
      userTab: UserTab.Workspaces,
      start: '2025-12-22T00:00:00.000Z',
      end: '2026-03-22T00:00:00.000Z',
    },
  }
}
