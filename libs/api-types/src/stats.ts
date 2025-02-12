export type StatType = 'vessels' | 'detections'
export type StatsParams = 'FLAGS' | 'VESSEL-IDS'
export type StatsIncludes = 'TOTAL_COUNT' | 'TIME_SERIES' | 'EVENTS_GROUPED'

export type StatField =
  | 'id'
  | 'flags'
  | 'vesselIds'
  | 'activityHours'
  | 'geartype'
  | 'minLat'
  | 'minLon'
  | 'maxLat'
  | 'maxLon'

export type StatFields = {
  [key in StatField]: number
} & { type: StatType }

export type StatsByVessel = {
  numEvents: number
  portCountry?: string
  portName?: string
  totalDuration?: number
  flag: string
  mmsi: string
  vesselId: string
  shipName: string
  vesselType: string
}
