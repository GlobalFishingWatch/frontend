import type { QueryParams } from 'types'

import type { RoutePathValues } from './routes.utils'

export type LinkToPayload = {
  reportId?: string
  vesselId?: string
  category?: string
  workspaceId?: string
  datasetId?: string
  areaId?: string
  vesselGroupId?: string
  portId?: string
}

/**
 * TanStack Router-native navigation structure.
 * Used for history navigation and route state tracking.
 */
export type LinkTo = {
  /** TanStack Router path pattern (e.g., '/$category/$workspaceId/vessel/$vesselId') */
  to: RoutePathValues
  /** Route params matching the path pattern */
  params?: LinkToPayload
  /** Query/search params */
  search: QueryParams
  /** Flag indicating if this is a history navigation */
  isHistoryNavigation?: boolean
}
