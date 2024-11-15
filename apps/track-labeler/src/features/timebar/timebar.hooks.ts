import { useSelector } from 'react-redux'
import {
  selectTimebarMode,
  getDateRange,
  selectFilterMode,
  selectColorMode,
} from '../../routes/routes.selectors'
import { updateQueryParams } from '../../routes/routes.actions'
import { CoordinatePosition } from '../../types'
import {
  addSelectedTrack,
  SelectedTrackType,
  setSelectedTrack,
  updateSelectedTrack,
} from '../../features/vessels/selectedTracks.slice'
import { selectTimestamps } from '../../features/vessels/vessels.slice'
import { findNextTimestamp, findPreviousTimestamp } from '../../utils/shared'
import { useAppDispatch } from '../../store.hooks'

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
  const onEventPointClick = (
    segments: SelectedTrackType[],
    timestamp: number,
    position?: CoordinatePosition
  ) => {
    const lastPosition: number = segments.length - 1
    let rebuildSegments = false
    const lastSegment: SelectedTrackType = segments[lastPosition]
    let lastSegmentAdded: SelectedTrackType = lastSegment
    if (
      lastPosition >= 0 &&
      segments[lastPosition].start !== null &&
      segments[lastPosition].end === null
    ) {
      const start = lastSegment.start ?? 0
      const startLatitude = lastSegment.startLatitude ?? 0
      const startLongitude = lastSegment.startLongitude ?? 0
      if (start < timestamp) {
        lastSegmentAdded = {
          start: start,
          startLatitude: startLatitude,
          startLongitude: startLongitude,
          end: timestamp,
          endLatitude: position?.latitude ?? null,
          endLongitude: position?.longitude,
        }
        dispatch(
          updateSelectedTrack({
            index: lastPosition,
            segment: lastSegmentAdded,
          })
        )
        rebuildSegments = true
      } else {
        lastSegmentAdded = {
          start: timestamp,
          startLatitude: position?.latitude ?? null,
          startLongitude: position?.longitude ?? null,
          end: start,
          endLatitude: startLatitude,
          endLongitude: startLongitude,
        }
        dispatch(
          updateSelectedTrack({
            index: lastPosition,
            segment: lastSegmentAdded,
          })
        )
        rebuildSegments = true
      }
    } else {
      dispatch(
        addSelectedTrack({
          start: timestamp,
          startLatitude: position?.latitude ?? null,
          startLongitude: position?.longitude ?? null,
          end: null,
        })
      )
    }
    if (rebuildSegments && segments.length > 1) {
      const newSegments: SelectedTrackType[] = []
      //let previousSegment: SelectedTrackType|null = null;
      segments.forEach((segment1: SelectedTrackType) => {
        if (segment1.start && segment1.end && lastSegmentAdded.start && lastSegmentAdded.end) {
          // This case segment 1 cover all lastSegmentAdded
          if (segment1.start <= lastSegmentAdded.start && segment1.end >= lastSegmentAdded.end) {
            newSegments.push(
              {
                ...segment1,
                end: findPreviousTimestamp(timestamps, lastSegmentAdded.start),
                endLatitude: lastSegmentAdded.startLatitude,
                endLongitude: lastSegmentAdded.startLongitude,
              },
              /*{
                ...lastSegmentAdded,
              },*/
              {
                ...segment1,
                start: findNextTimestamp(timestamps, lastSegmentAdded.end),
                startLatitude: lastSegmentAdded.endLatitude,
                startLongitude: lastSegmentAdded.endLongitude,
              }
            )
          }
          // This case segment 1 is inside lastSegmentAdded
          else if (
            segment1.start >= lastSegmentAdded.start &&
            segment1.end <= lastSegmentAdded.end
          ) {
            //the segment 1 is removed
            //newSegments.push({ ...lastSegmentAdded })
          }
          // This case lastSegmentAdded take the first part of a saved segment
          else if (
            lastSegmentAdded.start <= segment1.start &&
            lastSegmentAdded.end >= segment1.start &&
            lastSegmentAdded.end <= segment1.end
          ) {
            newSegments.push({
              ...segment1,
              start: findNextTimestamp(timestamps, lastSegmentAdded.end),
              startLatitude: lastSegmentAdded.endLatitude,
              startLongitude: lastSegmentAdded.endLongitude,
            })
          }
          // This case lastSegmentAdded takes the last part of a segment
          else if (
            lastSegmentAdded.end >= segment1.end &&
            lastSegmentAdded.start >= segment1.start &&
            lastSegmentAdded.start <= segment1.end
          ) {
            newSegments.push({
              ...segment1,
              end: findPreviousTimestamp(timestamps, lastSegmentAdded.start),
              endLatitude: lastSegmentAdded.startLatitude,
              endLongitude: lastSegmentAdded.startLongitude,
            })
          } else {
            newSegments.push({
              ...segment1,
            })
          }
        }
      })
      newSegments.push({
        ...lastSegmentAdded,
      })
      const filteredNewSegments: SelectedTrackType[] = newSegments?.filter((s) => s)
      const sortedNewSegments = filteredNewSegments.sort(
        (n1: SelectedTrackType, n2: SelectedTrackType) => {
          if (n1.start && n2.start) {
            return n1.start - n2.start
          }
          return 1
        }
      )
      dispatch(setSelectedTrack(sortedNewSegments))
    }
  }

  return {
    onEventPointClick,
  }
}
