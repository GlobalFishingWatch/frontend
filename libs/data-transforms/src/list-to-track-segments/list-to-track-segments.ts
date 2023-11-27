import { groupBy, toNumber } from 'lodash'
import { DateTime, DateTimeOptions } from 'luxon'
import { Segment } from '@globalfishingwatch/api-types'
import { Columns } from './types'

type Args = Columns & {
  records: Record<string, any>[]
}

type DateTimeParseFunction = { (timestamp: string, opts: DateTimeOptions | undefined): DateTime }

export const getUTCDate = (timestamp: string | number) => {
  // it could receive a timestamp as a string
  const millis = toNumber(timestamp)
  if (typeof timestamp === 'number' || !isNaN(millis))
    return DateTime.fromMillis(millis, { zone: 'utc' }).toJSDate()

  const tryParseMethods: DateTimeParseFunction[] = [
    DateTime.fromISO,
    DateTime.fromSQL,
    DateTime.fromRFC2822,
  ]
  let result
  for (let index = 0; index < tryParseMethods.length; index++) {
    const parse = tryParseMethods[index]
    result = parse(timestamp, { zone: 'UTC' })
    if (result.isValid) {
      return result.toJSDate()
    }
  }
  return new Date('Invalid Date')
}

export const NO_RECORD_ID = 'no_id'

export const listToTrackSegments = ({
  records,
  latitude,
  longitude,
  timestamp,
  id,
}: Args): Segment[] => {
  const hasIdGroup = id !== undefined && id !== ''
  const grouped = hasIdGroup ? groupBy(records, id) : { no_id: records }
  const segments = Object.values(grouped).map((groupedRecords) => {
    return groupedRecords.flatMap((record) => {
      const recordId = id && record[id] ? record[id] : NO_RECORD_ID
      if (record[latitude] && record[longitude] && record[timestamp]) {
        const latitudeValue = record[latitude]
        const longitudeValue = record[longitude]
        const timestampValue = record[timestamp]
        return {
          ...(hasIdGroup && { properties: { ...record } }),
          latitude: parseFloat(latitudeValue),
          longitude: parseFloat(longitudeValue),
          timestamp: getUTCDate(timestampValue).getTime(),
          id: recordId,
        }
      } else return []
    })
  })
  return segments
}
