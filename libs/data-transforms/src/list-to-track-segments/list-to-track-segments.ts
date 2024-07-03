import { groupBy, toNumber } from 'lodash'
import { DateTime, DateTimeOptions } from 'luxon'
import { TrackSegment } from '@globalfishingwatch/api-types'
import { SegmentColumns } from '../types'
import { parseCoords } from '../coordinates'
import { normalizePropertiesKeys } from '../schema'

type Args = SegmentColumns & {
  records: Record<string, any>[]
  lineColorBarOptions: { value: string }[]
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
    try {
      result = parse(timestamp, { zone: 'UTC' })
      if (result.isValid) {
        return result.toJSDate()
      }
    } catch (e) {
      return new Date('Invalid Date')
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
  lineColorBarOptions,
}: Args): TrackSegment[][] => {
  const hasIdGroup = lineId !== undefined && lineId !== ''
  const hasSegmentId = segmentId !== undefined && segmentId !== ''
  const recordsArray = Array.isArray(records) ? records : [records]
  const sortedRecords = startTime
    ? sortRecordsByTimestamp({ recordsArray, timestampProperty: startTime })
    : recordsArray
  const groupedLines = hasIdGroup ? groupBy(sortedRecords, lineId) : { no_id: sortedRecords }
  const lines = Object.values(groupedLines).map((line, index) => {
    const groupedSegments = hasSegmentId
      ? groupBy(line, segmentId)
      : { [Object.keys(groupedLines)[index]]: line }
    return Object.values(groupedSegments)
      .map((segment) => {
        return segment.flatMap((dirtyRecord) => {
          const record = normalizePropertiesKeys(dirtyRecord)
          const recordId = lineId && record[lineId] ? record[lineId] : NO_RECORD_ID
          if (record[latitude] && record[longitude]) {
            const { [latitude]: latitudeValue, [longitude]: longitudeValue, ...properties } = record
            const coords = parseCoords(latitudeValue, longitudeValue)
            if (coords) {
              const segmentProperties = {
                ...(hasIdGroup && {
                  [lineId]: properties[lineId],
                  color: lineColorBarOptions[index % lineColorBarOptions.length].value,
                }),
                ...(hasSegmentId && { [segmentId]: properties[segmentId] }),
              }
              return [
                {
                  properties: segmentProperties,
                  // We need the property at the root level for sidebar lines leyend
                  coordinateProperties: properties,
                  latitude: coords.latitude as number,
                  longitude: coords.longitude as number,
                  ...(startTime &&
                    record[startTime] && { timestamp: getUTCDate(record[startTime]).getTime() }),
                  id: recordId,
                },
              ]
            } else return []
          } else return []
        })
      })
      .filter((segment) => segment.length > 0)
  })
  return lines
}
