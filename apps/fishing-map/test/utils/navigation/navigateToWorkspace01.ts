import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

export function navigateToWorkspace01(): NavigationConfig {
  return {
    to: ROUTE_PATHS.WORKSPACE,
    params: {
      category: 'fishing-activity',
      workspaceId: 'workspace_01-user',
    },
    search: {
      latitude: -3.8615694264149405,
      longitude: 58.409644158248014,
      zoom: 3.1376592398253953,
      userTab: 'workspaces',
      start: '2022-01-01T00:00:00.000Z',
      end: '2023-01-01T00:00:00.000Z',
    },
  }
}
