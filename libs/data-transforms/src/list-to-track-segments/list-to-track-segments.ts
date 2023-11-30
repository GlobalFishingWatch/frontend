import { groupBy, toNumber } from 'lodash'
import { DateTime, DateTimeOptions } from 'luxon'
import { Segment } from '@globalfishingwatch/api-types'
import { parseCoords } from '@globalfishingwatch/data-transforms'
import { SegmentColumns } from '../types'

type Args = SegmentColumns & {
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
  const recordArray = Array.isArray(records) ? records : [records]
  const grouped = hasIdGroup ? groupBy(recordArray, id) : { no_id: recordArray }
  const segments = Object.values(grouped).map((groupedRecords) => {
    return groupedRecords.flatMap((record) => {
      const recordId = id && record[id] ? record[id] : NO_RECORD_ID
      if (record[latitude] && record[longitude] && record[timestamp]) {
        const {
          [latitude]: latitudeValue,
          [longitude]: longitudeValue,
          [timestamp]: timestampValue,
          ...properties
        } = record
        const coords = parseCoords(latitudeValue, longitudeValue)
        if (coords) {
          return {
            ...(hasIdGroup && { properties }),
            latitude: coords.latitude as number,
            longitude: coords.longitude as number,
            timestamp: getUTCDate(timestampValue).getTime(),
            id: recordId,
          }
        } else return []
      } else return []
    })
  })
  return segments
}
