import { normalizePropertiesKeys } from '../schema'
import { SegmentColumns } from '../types'

type Args = SegmentColumns & {
  record: Record<string, any>
}

export const checkRecordValidity = ({
  record: dirtyRecord,
  latitude,
  longitude,
  timestamp,
}: Args) => {
  const record = normalizePropertiesKeys(dirtyRecord)
  const errors = [] as string[]
  if (Number.isNaN(parseInt(record[latitude])) || record[latitude] > 90 || record[latitude] < -90) {
    errors.push('latitude')
  }
  if (
    Number.isNaN(parseInt(record[longitude])) ||
    record[longitude] > 180 ||
    record[longitude] < -180
  ) {
    errors.push('longitude')
  }
  if (timestamp) {
    const d = new Date(record[timestamp])
    if (!(d instanceof Date) || isNaN(d.getTime()) || d.getTime() <= 1) {
      errors.push('timestamp')
    }
  }
  return errors
}
