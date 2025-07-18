import type { SelectOption } from '@globalfishingwatch/ui-components'

import type { IdField } from 'features/vessel-groups/vessel-groups.slice'

// Look for these ID columns by order of preference
export const ID_COLUMN_LOOKUP: IdField[] = ['vesselId', 'imo', 'mmsi']

export const ID_COLUMNS_OPTIONS: SelectOption[] = ID_COLUMN_LOOKUP.map((key) => ({
  id: key,
  label: key.toUpperCase(),
}))

export const VESSEL_GROUPS_REPORT_RELEASE_DATE = '2024-10-24'
export const VESSEL_GROUPS_MIN_API_VERSION = 'v3'
