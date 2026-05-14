import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match a
 * navigation to a password-protected fishing-activity workspace_02-user-public
 * workspace.
 */
export const navigateToWorkspace02Action = setLocation({
  type: 'WORKSPACE',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'workspace_02-user-public',
  },
  pathname: '/fishing-activity/workspace_02-user-public',
  to: ROUTE_PATHS.WORKSPACE,
  query: {
    latitude: -48.57949801790946,
    longitude: -43.777381703360966,
    zoom: 1.8027528200145846,
    userTab: 'workspaces',
    start: '2025-12-22T00:00:00.000Z',
    end: '2026-03-22T00:00:00.000Z',
  } as QueryParams,
})
