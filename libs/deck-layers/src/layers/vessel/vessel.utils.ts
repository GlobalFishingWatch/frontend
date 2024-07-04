import { DateTime } from 'luxon'
import { memoize } from 'lodash'
import { VesselTrackData } from '@globalfishingwatch/deck-loaders'
import { ApiEvent, EventTypes, EventVessel, TrackSegment } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '../../utils'
import { VesselEventsLayer } from './VesselEventsLayer'

export const FIRST_YEAR_OF_DATA = 2012
export const CURRENT_YEAR = DateTime.now().year
export const getVesselResourceChunks = (start: number, end: number) => {
  const startDT = getUTCDateTime(start)
  const startYear = startDT.year
  const startDTBuffered = startYear > FIRST_YEAR_OF_DATA ? startDT.minus({ months: 2 }) : startDT
  const startYearBuffered = startDTBuffered.year

  const endDT = getUTCDateTime(end).minus({ milliseconds: 1 })
  const endYear = endDT.year
  const endDTBuffered = endYear < CURRENT_YEAR ? endDT.plus({ months: 2 }) : endDT
  const endYearBuffered = endDTBuffered.year

  const yearsDelta = endYear - startYear + 1

  const initialBuffer = startYearBuffered === startYear ? 0 : 1
  const finalBuffer = endYearBuffered === endYear ? 0 : 1

  // Prebuffering one year before and another after
  const yearsChunks = [...new Array(yearsDelta + initialBuffer + finalBuffer)].map((_, i) => {
    // Generating one full year per chunk so we could take advantage of browser cache more often
    const year = startYearBuffered + i
    const start = DateTime.fromObject({ year }, { zone: 'utc' }).toISO()
    const end = DateTime.fromObject({ year: year + 1 }, { zone: 'utc' }).toISO()
    return { start, end }
  })
  return yearsChunks
}

export const getSegmentsFromData = memoize(
  (data: VesselTrackData, includeMiddlePoints: boolean): TrackSegment[] => {
    const segmentsIndexes = data.startIndices
    const positions = data.attributes?.getPath?.value
    const timestamps = data.attributes?.getTimestamp?.value
    const speeds = data.attributes?.getSpeed?.value
    const elevations = data.attributes?.getElevation?.value

    if (!positions?.length || !timestamps.length) {
      return []
    }
    const timestampSize = data.attributes.getTimestamp!?.size
    const speedSize = data.attributes.getSpeed!?.size
    const elevationSize = data.attributes.getElevation!?.size

    const segments = segmentsIndexes.map((segmentIndex, i, segmentsIndexes) => {
      const points = [] as TrackSegment
      points.push({
        // longitude: positions[segmentIndex * pathSize],
        // latitude: positions[segmentIndex * pathSize + 1],
        timestamp: timestamps[segmentIndex / timestampSize],
        speed: speeds?.[segmentIndex / speedSize],
        elevation: elevations?.[segmentIndex / elevationSize],
      })
      const nextSegmentIndex = segmentsIndexes[i + 1] || timestamps.length - 1
      if (includeMiddlePoints && segmentIndex + 1 < nextSegmentIndex) {
        for (let index = segmentIndex + 1; index < nextSegmentIndex; index++) {
          points.push({
            timestamp: timestamps[index / timestampSize],
            speed: speeds?.[index / speedSize],
            elevation: elevations?.[index / elevationSize],
          })
        }
      }
      if (i === segmentsIndexes.length - 1) {
        points.push({
          timestamp: timestamps[timestamps.length - 1],
          speed: speeds?.[speeds.length - 1],
          elevation: elevations?.[elevations.length - 1],
        })
      } else {
        points.push({
          timestamp: timestamps[nextSegmentIndex / timestampSize - 1],
          speed: speeds?.[nextSegmentIndex / speedSize - 1],
          elevation: elevations?.[nextSegmentIndex / elevationSize - 1],
        })
      }
      return points
    })
    return segments
  }
)

export const getEvents = memoize(
  (layers: VesselEventsLayer[], types?: EventTypes[]) => {
    return layers
      .flatMap((layer: VesselEventsLayer): ApiEvent<EventVessel>[] => {
        const events = types
          ? types.includes(layer.props.type)
            ? layer.props.data
            : []
          : layer.props.data || []
        return events as ApiEvent[]
      }, [])
      .sort((a, b) => (a.start as number) - (b.start as number))
  },
  (layers, types) => `${layers.map((layer) => layer.id).join(',')}-${types?.join(',')}`
)
