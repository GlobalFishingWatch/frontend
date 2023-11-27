import { Columns } from './types'

type Args = Columns & {
  record: Record<string, any>
}

export const checkRecordValidity = ({ record, latitude, longitude, timestamp }: Args) => {
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
  const d = new Date(record[timestamp])
  if (!(d instanceof Date) || isNaN(d.getTime()) || d.getTime() <= 1) {
    errors.push('timestamp')
  }
  return errors
}
