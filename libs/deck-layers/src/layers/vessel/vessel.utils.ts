import { scaleLinear } from 'd3-scale'
import { uniqBy } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { ApiEvent, EventTypes, EventVessel, TrackSegment } from '@globalfishingwatch/api-types'
import { wrapLongitudes } from '@globalfishingwatch/data-transforms'
import type {
  UserTrackBinaryData,
  VesselTrackData,
  VesselTrackGraphExtent,
} from '@globalfishingwatch/deck-loaders'

import { getUTCDateTime } from '../../utils'

import type { VesselsColorByProperty } from './vessel.config'
import { VESSEL_GRAPH_COLORS } from './vessel.config'
import type { VesselEventsLayer } from './VesselEventsLayer'

function memoize<T extends (...args: any[]) => any>(
  fn: T,
  resolver: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver(...args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

export const FIRST_YEAR_OF_DATA = 2012
export const CURRENT_YEAR = DateTime.now().year
export const getVesselResourceChunks = (start: number, end: number) => {
  if (isNaN(start) || isNaN(end) || end < start) {
    return []
  }
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

export type GetSegmentsFromDataParams = {
  includeMiddlePoints?: boolean
  includeCoordinates?: boolean
  startTime?: number
  endTime?: number
  gapSegmentThreshold?: number
}

export const getSegmentsFromData = memoize(
  (
    data: VesselTrackData | UserTrackBinaryData,
    {
      includeMiddlePoints = false,
      includeCoordinates = false,
      startTime,
      endTime,
      gapSegmentThreshold,
    } = {} as GetSegmentsFromDataParams
  ): TrackSegment[] => {
    const segmentsIndexes = data.startIndices
    const positions = data.attributes?.getPath?.value
    const timestamps = data.attributes?.getTimestamp?.value
    const speeds = (data as VesselTrackData).attributes?.getSpeed?.value
    const elevations = (data as VesselTrackData).attributes?.getElevation?.value
    const gaps = (data as VesselTrackData).attributes?.getGap?.value

    if (!positions?.length || !timestamps.length) {
      return []
    }

    const pathSize = data.attributes.getPath?.size
    const timestampSize = data.attributes.getTimestamp?.size
    const speedSize = (data as VesselTrackData).attributes.getSpeed?.size
    const elevationSize = (data as VesselTrackData).attributes.getElevation?.size
    const gapSize = (data as VesselTrackData).attributes?.getGap?.size || 1
    const hasGapSupport = !!(gaps && gapSegmentThreshold)
    const totalPoints = timestamps.length / timestampSize

    // Pre-compute wrapped longitudes if needed
    const wrappedLongitudes = includeCoordinates
      ? wrapLongitudes(Array.from({ length: totalPoints }, (_, i) => positions[i * pathSize]))
      : undefined

    // Helper to get point data by index
    const getPointByIndex = (index: number) => {
      const longitude = wrappedLongitudes ? wrappedLongitudes[index] : positions[index * pathSize]

      return {
        ...(includeCoordinates && {
          longitude,
          latitude: positions[index * pathSize + 1],
        }),
        timestamp: timestamps[index * timestampSize],
        ...(speedSize && { speed: speeds?.[index * speedSize] || 0 }),
        ...(elevationSize && { elevation: elevations?.[index * elevationSize] || 0 }),
      }
    }

    // The segment from point `index` to the next point exceeds the gap threshold.
    // getGap stores the gap in hours, so compare directly against gapSegmentThreshold.
    const isGapAfter = (index: number): boolean => {
      if (!hasGapSupport || !gaps) {
        return false
      }
      return gaps[index * gapSize] > (gapSegmentThreshold as number)
    }

    const isTimestampInRange = (timestamp: number, isFirstAfterEndTime: boolean): boolean => {
      if (startTime && timestamp <= startTime && !isFirstAfterEndTime) return false
      if (endTime && timestamp >= endTime && !isFirstAfterEndTime) return false
      return true
    }

    // Track if we've already included the first point after endTime (for course calculation)
    let firstPointAfterEndTimeIncluded = false

    const segments: TrackSegment[] = []

    segmentsIndexes.forEach((segmentIndex, i) => {
      const isLastSegment = i === segmentsIndexes.length - 1
      const nextSegmentIndex = segmentsIndexes[i + 1] ?? totalPoints
      const segmentEndIndex = isLastSegment ? totalPoints : nextSegmentIndex

      // Collect the in-time-range point indices for this path
      const inRange: number[] = []
      for (let pointIndex = segmentIndex; pointIndex < segmentEndIndex; pointIndex++) {
        const timestamp = timestamps[pointIndex * timestampSize]
        const isFirstAfterEndTime =
          endTime && timestamp >= endTime && !firstPointAfterEndTimeIncluded

        if (!isTimestampInRange(timestamp, isFirstAfterEndTime)) continue

        if (isFirstAfterEndTime) {
          firstPointAfterEndTimeIncluded = true
        }
        inRange.push(pointIndex)
      }

      // Split the path into sub-segments wherever the gap to the next point exceeds the threshold
      let current: number[] = []
      const flushCurrent = () => {
        if (!current.length) return
        const run = current
        const points = run
          .filter((_, idx) => includeMiddlePoints || idx === 0 || idx === run.length - 1)
          .map((pointIndex) => getPointByIndex(pointIndex))
        segments.push(points)
        current = []
      }

      for (let k = 0; k < inRange.length; k++) {
        const pointIndex = inRange[k]
        current.push(pointIndex)
        if (k < inRange.length - 1 && isGapAfter(pointIndex)) {
          flushCurrent()
        }
      }
      flushCurrent()
    })

    return segments
  },
  (data, params) => {
    const lengths = [
      data?.attributes?.getPath?.value.length,
      (data as VesselTrackData)?.attributes?.getSpeed?.value.length,
      (data as VesselTrackData)?.attributes?.getElevation?.value.length,
      data?.attributes?.getTimestamp?.value.length,
    ]

    return `${data?.startIndices?.join(',')}-${lengths.join(',')}-${JSON.stringify(params || {})}`
  }
)

export const getEvents = memoize(
  (
    layers: VesselEventsLayer[],
    { types } = {} as { types?: EventTypes[]; startTime?: number; endTime?: number }
  ) => {
    return uniqBy(
      layers.flatMap((layer: VesselEventsLayer): ApiEvent<EventVessel>[] => {
        const events =
          types && types.length
            ? types.includes(layer.props.type)
              ? layer.props.data
              : []
            : layer.props.data || []
        return events as ApiEvent[]
      }, []),
      (e) => e.id
    ).sort((a, b) => (a.start as number) - (b.start as number))
  },
  (layers, { types, startTime, endTime }) => {
    const typesHash = types?.join(',')
    const layersLength = layers.length
    const layersIdsHash = layers.map((layer) => layer.id).join(',')
    const layersLoaded = layers.map((layer) => layer.isLoaded).join(',')
    const chunksHash = JSON.stringify(getVesselResourceChunks(startTime, endTime))
    return `${layersLength}-${layersLoaded}-${layersIdsHash}-${typesHash}-${chunksHash}`
  }
)

export const VESSEL_GRAPH_STEPS = VESSEL_GRAPH_COLORS.length

function generateVesselGraphStepValues(extent: VesselTrackGraphExtent) {
  const scale = scaleLinear([0, VESSEL_GRAPH_STEPS], extent).clamp(true)
  const steps = [...Array(VESSEL_GRAPH_STEPS)].map((_, i) => scale(i))
  return steps
}

export function generateVesselGraphSteps(
  extent: VesselTrackGraphExtent,
  colorBy: VesselsColorByProperty
) {
  return generateVesselGraphStepValues(extent).map((value, index) => {
    const colorIndex = colorBy === 'speed' ? index : VESSEL_GRAPH_COLORS.length - 1 - index
    return {
      value,
      color: VESSEL_GRAPH_COLORS[colorIndex],
    }
  })
}
