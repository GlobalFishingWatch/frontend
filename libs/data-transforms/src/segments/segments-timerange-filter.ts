import { TrackSegment } from '@globalfishingwatch/api-types'

/**
 * Filter segments by timerange
 * @param segments Segment[]
 * @param timeRange supports isoString or timestamp start and end dates
 * @returns Bbox array
 */
type TimeRange = { start: string | number; end: string | number }
export function filterSegmentsByTimerange(
  segments: TrackSegment[],
  {
    start,
    end,
    includeNonTemporalSegments = false,
  }: TimeRange & { includeNonTemporalSegments?: boolean }
): TrackSegment[] {
  const startTimestamp = typeof start === 'number' ? start : new Date(start).getTime()
  const endTimestamp = typeof end === 'number' ? end : new Date(end).getTime()
  const filteredSegments = segments
    .map((segment) => {
      return (segment || []).flatMap((point) => {
        if (!point.timestamp) {
          return includeNonTemporalSegments ? point : []
        }
        return point.timestamp > startTimestamp && point.timestamp < endTimestamp ? point : []
      })
    })
    .filter((segment) => segment.length > 0)
  return filteredSegments
}
