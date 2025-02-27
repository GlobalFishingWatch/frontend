export type ReportTableVessel = {
  id: string
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
