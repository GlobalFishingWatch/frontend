import { groupBy } from 'es-toolkit'

import type { TrackSegment } from '@globalfishingwatch/api-types'

import { isValidLngLat, parseCoords } from '../coordinates'
import { getUTCDate } from '../dates'
import { normalizePropertiesKeys } from '../schema'
import { COORDINATES_PROPERTIES_ID } from '../segments/segments.config'
import type { SegmentColumns } from '../types'

type Args = SegmentColumns & {
  records: Record<string, any>[]
  lineColorBarOptions: { value: string }[]
}

export const NO_RECORD_ID = 'no_id'

const sortRecordsByTimestamp = ({
  recordsArray,
  timestampProperty,
}: {
  recordsArray: Record<string, any>[]
  timestampProperty: string | number
}) => {
  return [...(recordsArray || [])].sort((a: Record<string, any>, b: Record<string, any>) =>
    a[timestampProperty] && b[timestampProperty]
      ? getUTCDate(a[timestampProperty]).getTime() - getUTCDate(b[timestampProperty]).getTime()
      : 1
  )
}

const splitSegmentAtAntimeridian = (segment: TrackSegment): TrackSegment[] =>
  segment.reduce(
    (splitSegments: TrackSegment[], point, index) => {
      const previousPoint = segment[index - 1]
      if (
        previousPoint &&
        Math.abs((point.longitude ?? 0) - (previousPoint.longitude ?? 0)) > 180
      ) {
        splitSegments.push([])
      }
      splitSegments[splitSegments.length - 1].push(point)
      return splitSegments
    },
    [[]] as TrackSegment[]
  )

export const listToTrackSegments = ({
  records,
  latitude,
  longitude,
  startTime,
  segmentId,
  lineId,
  lineColorBarOptions,
}: Args): { segments: TrackSegment[][]; metadata: Record<string, any> } => {
  let hasDatesError = false
  const hasIdGroup = lineId !== undefined && lineId !== ''
  const hasSegmentId = segmentId !== undefined && segmentId !== ''
  const recordsArray = Array.isArray(records) ? records : [records]
  const sortedRecords = startTime
    ? sortRecordsByTimestamp({ recordsArray, timestampProperty: startTime })
    : recordsArray
  const groupedLines = groupBy(sortedRecords, (record) =>
    hasIdGroup ? `${record[lineId]}` : NO_RECORD_ID
  )
  const segments = Object.values(groupedLines).map((line, lineIndex) => {
    const groupedSegments = hasSegmentId
      ? groupBy(line, (s) => s[segmentId])
      : { [Object.keys(groupedLines)[lineIndex]]: line }
    return Object.values(groupedSegments)
      .map((segment) => {
        return segment.flatMap((dirtyRecord) => {
          const record = normalizePropertiesKeys(dirtyRecord)
          const recordId =
            lineId && record[lineId] ? record[lineId] : `${NO_RECORD_ID}-${lineIndex}`
          if (isValidLngLat(record[longitude], record[latitude])) {
            const { [latitude]: latitudeValue, [longitude]: longitudeValue, ...properties } = record
            const coords = parseCoords(latitudeValue, longitudeValue)
            if (coords) {
              const startTimeMs = startTime ? getUTCDate(record[startTime]).getTime() : undefined
              if (startTimeMs !== undefined && isNaN(startTimeMs)) {
                hasDatesError = true
              }
              const lineProperties = {
                ...(hasIdGroup && {
                  [lineId]: properties[lineId],
                  color: lineColorBarOptions[lineIndex % lineColorBarOptions.length].value,
                }),
                ...(hasSegmentId && { [segmentId]: properties[segmentId] }),
              }
              return [
                {
                  properties: lineProperties,
                  // We need the property at the root level for sidebar lines leyend
                  [COORDINATES_PROPERTIES_ID]: properties,
                  latitude: coords.latitude as number,
                  longitude: coords.longitude as number,
                  ...(startTimeMs && { timestamp: startTimeMs }),
                  id: recordId,
                },
              ]
            } else return []
          } else return []
        })
      })
      .flatMap(splitSegmentAtAntimeridian)
      .filter((segment) => segment.length > 0)
  })
  return { segments, metadata: { hasDatesError } }
}
