import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match a
 * navigation to a private fishing-activity workspace_01-user workspace.
 *
 * Replaces the legacy RFR `{ type: 'WORKSPACE', payload, meta.location, query }`
 * blob; specs continue to use `store.dispatch(navigateToWorkspace01Action)`.
 */
export const navigateToWorkspace01Action = setLocation({
  type: 'WORKSPACE',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'workspace_01-user',
  },
  pathname: '/fishing-activity/workspace_01-user',
  to: ROUTE_PATHS.WORKSPACE,
  query: {
    latitude: -3.8615694264149405,
    longitude: 58.409644158248014,
    zoom: 3.1376592398253953,
    userTab: 'workspaces',
    start: '2022-01-01T00:00:00.000Z',
    end: '2023-01-01T00:00:00.000Z',
  } as QueryParams,
})
