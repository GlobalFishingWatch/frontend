import createTree from 'functional-red-black-tree'
import { DateTime } from 'luxon'
import { createSelector } from 'reselect'

import type { TrackPoint, TrackSegment } from '@globalfishingwatch/api-types'

import { Field } from '../../data/models'
import type { SelectedTrackType } from '../../features/vessels/selectedTracks.slice'
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import {
  selectOriginalTracks,
  selectTracks,
  selectVessels,
} from '../../features/vessels/vessels.slice'
import {
  selectFilteredDistanceFromPort,
  selectFilteredElevation,
  selectFilteredHours,
  selectFilteredSpeed,
  selectFilterMode,
  selectQueryParam,
  selectVessel,
} from '../../routes/routes.selectors'
import type { LayersData } from '../../types'
import { ActionType } from '../../types'

export const getVesselTrack = createSelector(
  [selectTracks, selectQueryParam('vessel')],
  (tracks, vessel) => {
    return tracks && tracks[vessel] !== undefined ? tracks[vessel] : null
  }
)

export const selectVesselOriginalTrack = createSelector(
  [selectOriginalTracks, selectQueryParam('vessel')],
  (originalTracks, vessel) => {
    return originalTracks && originalTracks[vessel] !== undefined && originalTracks[vessel].track
      ? originalTracks[vessel].track
      : null
  }
)
/**
 * Get if the track request is loading
 */
export const getVesselTrackLoading = createSelector([getVesselTrack], (trackData) => {
  return trackData !== null ? trackData.loading : true
})

/**
 * Get the track after its loaded
 */
export const getVesselTrackData = createSelector([getVesselTrack], (trackData) => {
  return trackData !== null ? trackData.track : null
})

/**
 * Get the {min, max} range specified for the current filterMode
 */
export const selectCurrentFilterRange = createSelector(
  [
    selectFilterMode,
    selectFilteredElevation,
    selectFilteredHours,
    selectFilteredSpeed,
    selectFilteredDistanceFromPort,
  ],
  (
    filterMode,
    elevationFilterRange,
    hoursFilterRange,
    speedFilterRange,
    distanceFromPortFilterRange
  ) => {
    switch (filterMode) {
      case Field.speed:
        return { min: speedFilterRange.minSpeed, max: speedFilterRange.maxSpeed }
      case Field.elevation:
        return { min: elevationFilterRange.minElevation, max: elevationFilterRange.maxElevation }
      case Field.timestamp:
        return { min: hoursFilterRange.fromHour, max: hoursFilterRange.toHour }
      case Field.distanceFromPort:
        return {
          min: distanceFromPortFilterRange.minDistanceFromPort,
          max: distanceFromPortFilterRange.maxDistanceFromPort,
        }
      default:
        return {
          min: -Infinity,
          max: Infinity,
        }
    }
  }
)

type PointEvent = Partial<Record<Field, number | null>>

/**
 * Get the event filter callback for the current filterMode and (min, max) ranges
 */
export const selectEventFilteringFunction = createSelector(
  [selectFilterMode, selectCurrentFilterRange],
  (filterMode: Field, { min, max }) => {
    switch (filterMode) {
      case Field.speed:
        return (event: PointEvent) =>
          event.timestamp &&
          event.speed !== undefined &&
          event.speed !== null &&
          event.speed >= min &&
          event.speed <= max
      case Field.elevation:
        return (event: PointEvent) =>
          event.timestamp &&
          event.elevation !== undefined &&
          event.elevation !== null &&
          event.elevation >= min &&
          event.elevation <= max
      case Field.timestamp:
        return (event: PointEvent) => {
          if (event.timestamp === null || event.timestamp === undefined) return false
          const date = DateTime.fromMillis(event.timestamp as number, { zone: 'UTC' })
          return date.hour >= min && date.hour <= max
        }
      case Field.distanceFromPort:
        return (event: PointEvent) =>
          event.timestamp &&
          event.distance_from_port !== undefined &&
          event.distance_from_port !== null &&
          event.distance_from_port >= min &&
          event.distance_from_port <= max
      default:
        return () => false
    }
  }
)

/**
 * Get the track and filter it by the range slider in the timebar
 */
export const getVesselTrackFiltered = createSelector(
  [getVesselTrackData, selectEventFilteringFunction],
  (track, eventFilteringFunction) => {
    const tracksData = track !== null ? (track.data as TrackSegment[]) : []
    const filteredTracks = tracksData.map((track: TrackSegment) => {
      return track.filter((event: TrackPoint) => eventFilteringFunction(event))
    })
    return filteredTracks
  }
)

/**
 * just return the track from another filtered selector, kept as legacy
 */
export const getVesselInfo = createSelector([selectVessels, selectVessel], (vessels, id) => {
  if (vessels && vessels[id]) {
    return vessels[id]
  }

  return null
})

export const getVesselFilteredTrackGeojsonByDateRange = createSelector(
  [getVesselTrackFiltered],
  (track) => {
    if (!track) return null

    return track
  }
)

/**
 * just return the original track from another selector, kept as legacy
 */
export const getVesselTrackGeojsonByDateRange = createSelector([getVesselTrackData], (track) => {
  if (!track) return null

  return track.data
})

/**
 * This function return the vessel action in a specific moment based in the selected segments
 * @param point a specific point in the track
 * @param selectedTracks selected tracks tree
 */
const getCurrentVesselAction = (point: TrackPoint, selectedTracks: any) => {
  const defaultAction: ActionType = ActionType.untracked
  if (!point.timestamp || selectedTracks.length === 0) {
    return defaultAction
  }

  const getNodeAction = (node: any, timestamp: number) => {
    if (!node.valid) {
      return
    }
    const { start, end, action } = node.value as SelectedTrackType
    if (start && end && timestamp >= start && timestamp <= end) {
      return action ?? ActionType.selected
    }
  }
  const first = selectedTracks.ge(point.timestamp as number)
  const last = selectedTracks.le(point.timestamp as number)
  return (
    getNodeAction(first, point.timestamp) || getNodeAction(last, point.timestamp) || defaultAction
  )
}

/**
 * Convert the selected tracks to a b-tree so it's faster to find the points inside selected tracks
 */
export const getSelectedTracksTree = createSelector([selectedtracks], (selectedtracks): any => {
  let tree = createTree<number, SelectedTrackType>()
  selectedtracks
    .filter((track: SelectedTrackType) => track.end && track.start)
    .forEach((track: SelectedTrackType) => {
      tree = tree.insert(track.start as number, track)
    })
  return tree
})

/**
 * Transform the original track into segments by the action specified in the selected segments by the user
 */
export const getVesselParsedTrack = createSelector(
  [getVesselTrackGeojsonByDateRange, getSelectedTracksTree],
  (vesselTrack, selectedTracksTree): LayersData[] => {
    if (!vesselTrack) {
      return []
    }

    const layersData: LayersData[] = []
    vesselTrack
      // Do not use tracks without segments
      .filter((segment: TrackSegment) => segment.length)
      .forEach((segment: any) => {
        let trackPoints: TrackPoint[] = []
        let actionFlag: ActionType | string = getCurrentVesselAction(segment[0], selectedTracksTree)
        segment.forEach((point: TrackPoint) => {
          const currentAction: ActionType | string | null = getCurrentVesselAction(
            point,
            selectedTracksTree
          )

          if (currentAction !== actionFlag) {
            if (actionFlag !== ActionType.untracked) {
              layersData.push({
                trackPoints: trackPoints,
                action: actionFlag,
              })
            }
            if (currentAction !== ActionType.untracked) {
              trackPoints = [point]
            } else {
              trackPoints = []
            }
          } else {
            if (currentAction !== ActionType.untracked) {
              trackPoints.push(point)
            }
          }
          actionFlag = currentAction ?? ''
        })
        layersData.push({
          trackPoints: trackPoints,
          action: actionFlag,
        })
        trackPoints = []
      })
    return layersData.filter((data: LayersData) => data.trackPoints && data.trackPoints.length > 0)
  }
)

/**
 * Transform the filtered track into segments by the action specified in the selected segments by the user
 */
export const getVesselParsedFilteredTrack = createSelector(
  [getVesselFilteredTrackGeojsonByDateRange, getSelectedTracksTree],
  (vesselTrack, selectedTracksTree): LayersData[] => {
    const layersData: LayersData[] = []
    if (!vesselTrack) {
      return []
    }

    vesselTrack
      // Do not use tracks without segments
      .filter((segment: TrackSegment) => segment.length)
      .forEach((segment: TrackSegment) => {
        let trackPoints: TrackPoint[] = []
        let actionFlag: ActionType | string = (segment[0] as any).action
        segment.forEach((point: TrackPoint) => {
          const currentAction: ActionType | string | null = getCurrentVesselAction(
            point,
            selectedTracksTree
          )

          if (currentAction !== actionFlag) {
            layersData.push({
              trackPoints: trackPoints,
              action: actionFlag,
            })
            trackPoints = [point]
          } else {
            trackPoints.push(point)
          }
          actionFlag = currentAction ?? ''
        })
        layersData.push({
          trackPoints: trackPoints,
          action: actionFlag,
        })
        trackPoints = []
      })
    return layersData
  }
)
