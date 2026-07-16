import type { SelectOption } from '@globalfishingwatch/ui-components'

import type { IdField } from 'features/vessel-groups/vessel-groups.slice'

export const VMS_PROPERTY_PREFIX = 'selfReportedInfo.'

// Look for these ID columns by order of preference
export const ID_COLUMN_LOOKUP: IdField[] = ['mmsi', 'imo', 'vesselId']
export const CSV_COLUMN_LOOKUP: string[] = [...ID_COLUMN_LOOKUP, 'flag']

export const ID_COLUMNS_OPTIONS: SelectOption<IdField, string>[] = ID_COLUMN_LOOKUP.map((key) => ({
  id: key,
  label: key.toUpperCase(),
}))

export const ID_FIELD_SEARCH_CANDIDATES: IdField[] = [
  ...ID_COLUMN_LOOKUP,
  'callsign',
  'shipname',
  'externalId',
  'fishingLicenseCode',
  'vesselRegistrationCode',
]

export const VESSEL_GROUPS_REPORT_RELEASE_DATE = '2024-10-24'
export const VESSEL_GROUPS_MIN_API_VERSION = 'v3'
