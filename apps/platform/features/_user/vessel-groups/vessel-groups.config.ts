import type { SelectOption } from '@globalfishingwatch/ui-components'

import type { IdField } from 'features/_user/vessel-groups/vessel-groups.slice'

export const VMS_PROPERTY_PREFIX = 'selfReportedInfo.'

// Identity datasets advertise a bare `id` filter alongside `selfReportedInfo.id`, but the vessels
// search `where` grammar only accepts the prefixed one — a bare `id = "..."` is rejected with a 422
// syntax error. getAdvancedSearchQuery() in @globalfishingwatch/api-client applies the same rewrite.
export const SELF_REPORTED_ONLY_SEARCH_PROPERTIES = new Set(['id'])

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
