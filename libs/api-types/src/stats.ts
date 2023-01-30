export type StatType = 'vessels' | 'detections'
export type StatsParams = 'flags' | 'vessel-ids'

export type StatField =
  | 'id'
  | 'flag'
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
