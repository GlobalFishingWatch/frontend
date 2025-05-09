export type StatType = 'vessels' | 'detections'
export type StatsParams = 'FLAGS' | 'VESSEL-IDS'
export type StatsIncludes = 'TOTAL_COUNT' | 'TIME_SERIES' | 'EVENTS_GROUPED'
export type StatsGroupBy =
  | 'FLAG'
  | 'GEARTYPE'
  | 'REGION_EEZ'
  | 'REGION_EEZ12NM'
  | 'REGION_FAO'
  | 'REGION_HIGH_SEAS'
  | 'REGION_MAJOR_FAO'
  | 'REGION_MPA'
  | 'REGION_MPA_NO_TAKE'
  | 'REGION_MPA_NO_TAKE_PARTIAL'
  | 'REGION_RFMO'

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
  totalDuration?: number
  flag: string
  mmsi: string
  vesselId: string
  shipName: string
  vesselType: string
}

export type StatsGroupedBy = {
  groups: {
    name: string
    value: number
  }[]
}
