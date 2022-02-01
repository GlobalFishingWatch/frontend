import { useState, useEffect, useRef } from 'react'
import Ola from 'ola'
import turfBearing from '@turf/bearing'
import lineSlice from '@turf/line-slice'
import getGeometryLength from '@turf/length'
import along from '@turf/along'
import { point, bearingToAzimuth, Position } from '@turf/helpers'
import memoizeOne from 'memoize-one'

const positionInterpolator = Ola({ distance: 0 }, 1000)

interface BearingOptions {
  rounded?: boolean
  final?: boolean
}
const getBearing = (
  start: Position | null,
  end: Position | null,
  options: BearingOptions = {}
): number => {
  if (!start || !end) return 0
  const { rounded = false, final = false } = options
  const bearing = bearingToAzimuth(turfBearing(point(start), point(end), { final }))
  return rounded ? Math.round(bearing) : bearing
}

interface CoordinateIndex {
  feature: number
  coordinate: number
}
interface ClosestTimestampsType {
  featureIndex: number
  timestamp: number
}

const memoizedTrackFilter = memoizeOne((track) =>
  track.features.filter((feature: any) => feature.properties.type === 'track')
)

const getCoordinatesIndexByTimestamp = (track: any, timestamp: number): CoordinateIndex => {
  let coordinateIndexes = {
    feature: -1,
    coordinate: -1,
  }
  if (track !== null && track.features !== undefined && timestamp) {
    const trackFeatures: any = memoizedTrackFilter(track)
    const closestTimestamps: ClosestTimestampsType[] = []
    for (let i = 0; i < trackFeatures.length; i++) {
      const { coordinateProperties } = trackFeatures[i].properties
      const closestTimestamp = coordinateProperties.times.reduce((prev: number, curr: number) => {
        return Math.abs(curr - timestamp) < Math.abs(prev - timestamp) ? curr : prev
      }, -1)
      closestTimestamps.push({ featureIndex: i, timestamp: closestTimestamp })
    }
    const closestTimestamp = closestTimestamps.reduce<ClosestTimestampsType>(
      (prev, curr) => {
        return Math.abs(curr.timestamp - timestamp) < Math.abs(prev.timestamp - timestamp)
          ? curr
          : prev
      },
      { featureIndex: 0, timestamp: 0 }
    )
    const closestCoordinateIndex = trackFeatures[
      closestTimestamp.featureIndex
    ].properties.coordinateProperties.times.findIndex(
      (t: number) => t === closestTimestamp.timestamp
    )
    if (closestCoordinateIndex > -1) {
      coordinateIndexes = {
        feature: closestTimestamp.featureIndex,
        coordinate: closestCoordinateIndex,
      }
    }
  }
  return coordinateIndexes
}

export const getEventCoordinates = (track: any, timestamp: number, offset = 0): Position | null => {
  const { feature, coordinate } = getCoordinatesIndexByTimestamp(track, timestamp)
  if (coordinate < 0) return null
  const { coordinates } = track.features[feature].geometry
  const eventCoordinates = coordinates[coordinate + offset]
    ? coordinates[coordinate + offset]
    : coordinates[coordinate]
  return eventCoordinates
}

const getNextDestinationDistance = (track: any, timestamp: number, percentage: number): number => {
  const { feature, coordinate } = getCoordinatesIndexByTimestamp(track, timestamp)
  if (coordinate < 0) return 0
  const { coordinates } = track.features[feature].geometry
  const destinationCoordinates = coordinates[coordinate]
  // TODO calculate this with a real event, not with next track step
  const followingDestinationCoordinates = coordinates[coordinate + 1]
  // TODO check when is last coordinate and should go to next feature
  if (!followingDestinationCoordinates) return 0
  const trackSliced = lineSlice(coordinates[0], destinationCoordinates, track.features[feature])
  const trackLength = getGeometryLength(trackSliced)
  const followingTrackStep = lineSlice(
    destinationCoordinates,
    followingDestinationCoordinates,
    track.features[feature]
  )
  const followingTrackStepLengh = getGeometryLength(followingTrackStep)
  return trackLength + (followingTrackStepLengh * percentage) / 100
}

const getNextPosition = (track: any, timestamp: number) => {
  const defaultValue = { center: null, nextDistance: 0 }
  if (track === null) return defaultValue

  const { feature } = getCoordinatesIndexByTimestamp(track, timestamp)
  const nextDistance = positionInterpolator.distance

  if (feature < 0 || !track.features[feature] || nextDistance <= 0) return defaultValue

  const nextCenter = along(track.features[feature], nextDistance)
  const coordinates: Position | null =
    (nextCenter && nextCenter.geometry && nextCenter.geometry.coordinates) || null
  return {
    center: coordinates !== null ? coordinates : null,
    nextDistance,
  }
}
interface UseCenterState {
  center: Position | null
  isMoving: boolean
  bearing: number
  currentDistance: number
}
export const useCenterByTimestamp = (track: any, timestamp: number, percentage = 0) => {
  const [state, setState] = useState<UseCenterState>({
    center: null,
    bearing: 0,
    isMoving: false,
    currentDistance: 0,
  })

  // const requestRef = useRef<any>()
  const destinationDistance = useRef<number>(0)

  useEffect(() => {
    const center = getEventCoordinates(track, timestamp)
    const nextStep = getEventCoordinates(track, timestamp, 1)
    const bearing = getBearing(center, nextStep, { rounded: true })
    setState((state) => {
      return { ...state, center, bearing }
    })
  }, [track, timestamp])

  useEffect(() => {
    const nextDistance = getNextDestinationDistance(track, timestamp, percentage)
    destinationDistance.current = nextDistance
    positionInterpolator.set({ distance: nextDistance })
  }, [track, timestamp, percentage])

  const { isMoving, currentDistance } = state
  useEffect(() => {
    const updateViewport = () => {
      const isGoingForward = currentDistance < destinationDistance.current
      if (currentDistance !== destinationDistance.current) {
        const { center, nextDistance } = getNextPosition(track, timestamp)
        setState((state) => {
          const bearing = center !== null ? getBearing(state.center, center, { rounded: true }) : 0
          return {
            center,
            isMoving: center !== null ? true : false,
            bearing: isGoingForward ? bearing : bearing - 180,
            currentDistance: nextDistance,
          }
        })
      } else if (isMoving) {
        setState((state) => {
          return { ...state, isMoving: false }
        })
      }
    }
    window.requestAnimationFrame(updateViewport)
  }, [isMoving, currentDistance, timestamp, track])
  return { ...state }
}
