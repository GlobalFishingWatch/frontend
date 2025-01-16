import { useState } from 'react'
import { useSelector } from 'react-redux'

import type { SelectedTrackType } from '../../features/vessels/selectedTracks.slice'
import { addSelectedTrack, setSelectedTrack } from '../../features/vessels/selectedTracks.slice'
import { selectTimestamps } from '../../features/vessels/vessels.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import {
  getDateRange,
  selectColorMode,
  selectFilterMode,
  selectTimebarMode,
} from '../../routes/routes.selectors'
import { useAppDispatch } from '../../store.hooks'
import type { CoordinatePosition } from '../../types'
import { findNextTimestamp, findPreviousTimestamp } from '../../utils/shared'

export const useTimerangeConnect = () => {
  const dispatch = useAppDispatch()
  const dateRange = useSelector(getDateRange)
  // TODO needs to be debounced like viewport
  const dispatchTimerange = ({ start, end }: { start: string; end: string }) => {
    if (start !== dateRange.start || end !== dateRange.end) {
      dispatch(updateQueryParams({ start, end }))
    }
  }

  const dispachHours = (hours: number[]) => {
    dispatch(updateQueryParams({ fromHour: hours[0].toString(), toHour: hours[1].toString() }))
  }
  const dispachElevation = (elevations: number[]) => {
    dispatch(
      updateQueryParams({
        minElevation: elevations[0].toString(),
        maxElevation: elevations[1].toString(),
      })
    )
  }

  const dispachDistanceFromPort = (distance: number[]) => {
    dispatch(
      updateQueryParams({
        minDistanceFromPort: distance[0].toString(),
        maxDistanceFromPort: distance[1].toString(),
      })
    )
  }
  const dispatchSpeed = (speed: number[]) => {
    dispatch(updateQueryParams({ minSpeed: speed[0].toString() }))
    dispatch(updateQueryParams({ maxSpeed: speed[1].toString() }))
  }

  return {
    start: dateRange.start,
    end: dateRange.end,
    dispatchTimerange,
    dispatchSpeed,
    dispachHours,
    dispachElevation,
    dispachDistanceFromPort,
  }
}

export const useTimebarModeConnect = () => {
  const dispatch = useAppDispatch()
  const timebarMode = useSelector(selectTimebarMode)
  const colorMode = useSelector(selectColorMode)
  const filterMode = useSelector(selectFilterMode)
  const dispatchTimebarMode = (newTimebarMode: string) =>
    dispatch(updateQueryParams({ timebarMode: newTimebarMode }))
  const dispatchFilterMode = (newFilterMode: string) =>
    dispatch(updateQueryParams({ filterMode: newFilterMode }))
  const dispatchColorMode = (newMode: string) => dispatch(updateQueryParams({ colorMode: newMode }))
  return {
    timebarMode,
    filterMode,
    colorMode,
    dispatchTimebarMode,
    dispatchFilterMode,
    dispatchColorMode,
  }
}

export const useSegmentsLabeledConnect = () => {
  const dispatch = useAppDispatch()
  const timestamps = useSelector(selectTimestamps)
  // Add internal state to track segment being created
  const [pendingSegment, setPendingSegment] = useState<{
    firstClick: {
      timestamp: number
      position: CoordinatePosition
    } | null
  }>({ firstClick: null })

  const createNewSegment = (
    timestamp1: number,
    position1: CoordinatePosition,
    timestamp2: number,
    position2: CoordinatePosition
  ): SelectedTrackType => {
    // Ensure the segment is always ordered by timestamp
    if (timestamp1 < timestamp2) {
      return {
        start: timestamp1,
        startLatitude: position1.latitude,
        startLongitude: position1.longitude,
        end: timestamp2,
        endLatitude: position2.latitude,
        endLongitude: position2.longitude,
      }
    } else {
      return {
        start: timestamp2,
        startLatitude: position2.latitude,
        startLongitude: position2.longitude,
        end: timestamp1,
        endLatitude: position1.latitude,
        endLongitude: position1.longitude,
      }
    }
  }

  const handleSegmentOverlap = (
    segment: SelectedTrackType,
    newSegment: SelectedTrackType,
    timestamps: number[]
  ): SelectedTrackType[] => {
    if (!segment.start || !segment.end || !newSegment.start || !newSegment.end) {
      return [segment]
    }

    // Case 1: Segment completely contains new segment
    if (segment.start <= newSegment.start && segment.end >= newSegment.end) {
      return [
        {
          ...segment,
          end: findPreviousTimestamp(timestamps, newSegment.start),
          endLatitude: newSegment.startLatitude,
          endLongitude: newSegment.startLongitude,
        },
        {
          ...segment,
          start: findNextTimestamp(timestamps, newSegment.end),
          startLatitude: newSegment.endLatitude,
          startLongitude: newSegment.endLongitude,
        },
      ]
    }

    // Case 2: New segment completely contains this segment
    if (segment.start >= newSegment.start && segment.end <= newSegment.end) {
      return [] // Remove this segment
    }

    // Case 3: Overlap at start
    if (newSegment.start <= segment.start && newSegment.end >= segment.start) {
      return [
        {
          ...segment,
          start: findNextTimestamp(timestamps, newSegment.end),
          startLatitude: newSegment.endLatitude,
          startLongitude: newSegment.endLongitude,
        },
      ]
    }

    // Case 4: Overlap at end
    if (newSegment.end >= segment.end && newSegment.start <= segment.end) {
      return [
        {
          ...segment,
          end: findPreviousTimestamp(timestamps, newSegment.start),
          endLatitude: newSegment.startLatitude,
          endLongitude: newSegment.startLongitude,
        },
      ]
    }

    // No overlap
    return [segment]
  }

  const onEventPointClick = (
    segments: SelectedTrackType[],
    timestamp: number,
    position?: CoordinatePosition
  ) => {
    if (!position) return

    // If there's no pending segment, store this as the first click
    if (!pendingSegment.firstClick) {
      setPendingSegment({
        firstClick: {
          timestamp,
          position,
        },
      })
      return
    }

    // If we have a first click, we can create a complete segment
    const newSegment = createNewSegment(
      pendingSegment.firstClick.timestamp,
      pendingSegment.firstClick.position,
      timestamp,
      position
    )

    // Reset pending segment
    setPendingSegment({ firstClick: null })

    // Handle overlaps with existing segments
    if (segments.length > 0) {
      const newSegments = segments
        .flatMap((segment) => handleSegmentOverlap(segment, newSegment, timestamps))
        .concat(newSegment)
        .filter(Boolean)
        .sort((a, b) => (a.start && b.start ? a.start - b.start : 1))

      dispatch(setSelectedTrack(newSegments))
    } else {
      // If no existing segments, just add the new one
      dispatch(addSelectedTrack(newSegment))
    }
  }

  return {
    onEventPointClick,
    // Expose whether we're in the middle of creating a segment
    isCreatingSegment: pendingSegment.firstClick !== null,
  }
}
