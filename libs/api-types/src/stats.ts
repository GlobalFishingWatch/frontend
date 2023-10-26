export type StatType = 'vessels' | 'detections'
export type StatsParams = 'FLAGS' | 'VESSEL-IDS'

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
