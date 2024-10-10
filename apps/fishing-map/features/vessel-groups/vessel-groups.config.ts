import { SelectOption } from '@globalfishingwatch/ui-components'
import { IdField } from 'features/vessel-groups/vessel-groups.slice'

// Look for these ID columns by order of preference
export const ID_COLUMN_LOOKUP: IdField[] = ['vesselId', 'mmsi', 'imo']

export const ID_COLUMNS_OPTIONS: SelectOption[] = ID_COLUMN_LOOKUP.map((key) => ({
  id: key,
  label: key.toUpperCase(),
}))

// TODO:VV3 set the proper date
export const VESSEL_GROUPS_REPORT_RELEASE_DATE = '2024-09-30'
