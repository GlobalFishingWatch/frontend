import type { AdvancedSearchQueryFieldKey } from '@globalfishingwatch/api-client'
import type { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { SearchType } from './search.config'

export type VesselSearchState = {
  /** Free-text search term (basic search) or name filter (advanced search) */
  query?: string
  /** Dataset ids the search is restricted to (only available in advanced mode) */
  sources?: string[]
  /** Whether the search UI is in basic or advanced mode */
  searchOption?: SearchType
  /** Identity source (registry vs self-reported) to search by (only available in advanced mode) */
  infoSource?: VesselIdentitySourceEnum
  /** Advanced search filter: only vessels transmitting before this date (only available in advanced mode) */
  lastTransmissionDate?: string
  /** Advanced search filter: only vessels transmitting after this date (only available in advanced mode) */
  firstTransmissionDate?: string
  /** Advanced search per-field filters (mmsi, imo, callsign, flag, owner, shiptype, etc), keyed by AdvancedSearchQueryFieldKey (only available in advanced mode) */
} & Partial<Record<AdvancedSearchQueryFieldKey, string | string[]>>
export type VesselSearchStateProperty = keyof VesselSearchState
