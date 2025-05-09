import type { ROUTE_TYPES } from 'routes/routes'
import type { QueryParams } from 'types'

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

export type LinkTo = {
  type: ROUTE_TYPES
  payload: LinkToPayload
  query: QueryParams
  isHistoryNavigation?: boolean
}
