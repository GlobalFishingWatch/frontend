import type { Dataset } from '@globalfishingwatch/api-types'

export type ReportTableVessel = {
  id: string
  // TODO:CVP remove index if not needed
  index?: number
  color?: string
  shipName: string
  vesselType: string
  geartype: string
  imo?: string
  callsign?: string
  flag: string
  flagTranslated: string
  flagTranslatedClean: string
  ssvid: string
  // TODO:CVP remove Dataset if not needed
  dataset?: Dataset
  dataviewId?: string
  datasetId: string
  trackDatasetId?: string
  // Only available in vessel group
  source?: string
  transmissionDateFrom?: string
  transmissionDateTo?: string
  // Only available for vessels from a report (not vessel group)
  value?: number
}
