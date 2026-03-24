import type { AdvancedSearchQueryFieldKey } from '@globalfishingwatch/api-client'
import type { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { SearchType } from './search.config'

export type VesselSearchState = {
  query?: string
  sources?: string[]
  searchOption?: SearchType
  infoSource?: VesselIdentitySourceEnum
} & Partial<Record<AdvancedSearchQueryFieldKey, string | string[]>>
export type VesselSearchStateProperty = keyof VesselSearchState
