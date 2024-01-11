import { groupBy, toNumber } from 'lodash'
import { DateTime, DateTimeOptions } from 'luxon'
import { Segment } from '@globalfishingwatch/api-types'
import { SegmentColumns } from '../types'
import { parseCoords } from '../coordinates'

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

const sortRecordsByTimestamp = ({
  recordsArray,
  timestampProperty,
}: {
  recordsArray: Record<string, any>[]
  timestampProperty: string | number
}) => {
  return recordsArray.toSorted((a: Record<string, any>, b: Record<string, any>) =>
    a[timestampProperty] && b[timestampProperty]
      ? getUTCDate(a[timestampProperty]).getTime() - getUTCDate(b[timestampProperty]).getTime()
      : 1
  )
}

export const listToTrackSegments = ({
  records,
  latitude,
  longitude,
  startTime,
  segmentId,
  lineId,
}: Args): Segment[][] => {
  const hasIdGroup = lineId !== undefined && lineId !== ''
  const recordsArray = Array.isArray(records) ? records : [records]
  const sortedRecords = startTime
    ? sortRecordsByTimestamp({ recordsArray, timestampProperty: startTime })
    : recordsArray
  const groupedLines = hasIdGroup ? groupBy(sortedRecords, lineId) : { no_id: sortedRecords }
  const lines = Object.values(groupedLines).map((groupedRecords) => {
    return groupedRecords.flatMap((record) => {
      const recordId = lineId && record[lineId] ? record[lineId] : NO_RECORD_ID
      if (record[latitude] && record[longitude]) {
        const { [latitude]: latitudeValue, [longitude]: longitudeValue, ...properties } = record
        const coords = parseCoords(latitudeValue, longitudeValue)
        if (coords) {
          if (segmentId) {
            const groupedSegments = groupBy(record, segmentId)
            return Object.values(groupedSegments).flatMap((segment: Record<string, any>) => {
              const {
                [latitude]: latitudeValue,
                [longitude]: longitudeValue,
                ...properties
              } = segment
              const coords = parseCoords(latitudeValue, longitudeValue)
              return coords
                ? {
                    ...(hasIdGroup && { properties }),
                    latitude: coords.latitude as number,
                    longitude: coords.longitude as number,
                    ...(startTime &&
                      record[startTime] && { timestamp: getUTCDate(record[startTime]).getTime() }),
                    id: recordId,
                  }
                : []
            })
          } else {
            return [
              {
                ...(hasIdGroup && { properties }),
                latitude: coords.latitude as number,
                longitude: coords.longitude as number,
                ...(startTime &&
                  record[startTime] && { timestamp: getUTCDate(record[startTime]).getTime() }),
                id: recordId,
              },
            ]
          }
        } else return []
      } else return []
    })
  })
  return lines
}
