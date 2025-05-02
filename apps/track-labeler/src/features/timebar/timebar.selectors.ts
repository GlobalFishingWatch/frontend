import { createSelector } from 'reselect'

import type { TrackPoint, TrackSegment } from '@globalfishingwatch/api-types'

import { TimebarMode } from '../../data/config'
import {
  getVesselFilteredTrackGeojsonByDateRange,
  getVesselParsedTrack,
  getVesselTrackData,
} from '../../features/tracks/tracks.selectors'
import {
  getDateRangeTS,
  selectFilterMode,
  selectMaxDistanceFromPort,
  selectMaxElevation,
  selectMaxSpeed,
  selectMinDistanceFromPort,
  selectMinElevation,
  selectMinSpeed,
  selectTimebarMode,
} from '../../routes/routes.selectors'
import type { DayNightLayer, VesselPoint } from '../../types'

import { getTimebarPoints } from './timebar.utils'

export const selectNightLayer = createSelector([getVesselTrackData], (tracks) => {
  if (tracks) {
    const tracksData = tracks !== null ? (tracks.data as TrackSegment[]) : []
    const nightLayers: DayNightLayer[] = tracksData.flatMap((segment: TrackSegment) => {
      let start: number = segment[0].timestamp ?? 0
      let end: number = segment[0].timestamp ?? 0
      let actualHour = segment[0].night
      const nightVariation: DayNightLayer[] = []
      segment.forEach((point: TrackPoint) => {
        if (actualHour !== point.night) {
          if (start && end) {
            nightVariation.push({
              isNight: actualHour ? true : false,
              from: start,
              to: end,
            })
            actualHour = point.night
            start = point.timestamp ?? 0
          }
        }
        end = point.timestamp ?? 0
      })
      return nightVariation
    })

    return nightLayers
  }
  return []
})

const maxTimebarValues: any = {
  speed: 12,
  hours: 12,
  bathymetry: 2000,
}

export const selectTracksGraphs = createSelector(
  [getVesselFilteredTrackGeojsonByDateRange, selectTimebarMode],
  (tracskData, currentTimebarMode) => {
    if (!tracskData) return null
    const color = '#fffff0'
    const segmentsWithCurrentFeature = tracskData.map((segment: any) => {
      return segment.map((pt: any) => {
        if (currentTimebarMode === TimebarMode.hours) {
          const date = new Date(pt.timestamp)
          const value = date.getUTCHours()
          return {
            date: pt.timestamp,
            value: value >= 12 ? value - 12 : value * -1,
          }
        } else {
          const value = pt[currentTimebarMode]
          return {
            date: pt.timestamp,
            value,
          }
        }
      })
    })
    return [
      {
        color,
        segmentsWithCurrentFeature,
        // TODO Figure out this magic value
        maxValue: maxTimebarValues[currentTimebarMode],
      },
    ]
  }
)

export const selectFilterModeValues = createSelector(
  [
    selectMaxSpeed,
    selectMinSpeed,
    selectMaxElevation,
    selectMinElevation,
    selectMinDistanceFromPort,
    selectMaxDistanceFromPort,
  ],
  (maxSpeed, minSpeed, maxElevation, minElevation, minDistanceFromPort, maxDistanceFromPort) => {
    return {
      speed: { max: maxSpeed, min: minSpeed },
      elevation: { max: maxElevation, min: minElevation },
      distanceFromPort: { max: maxDistanceFromPort, min: minDistanceFromPort },
    }
  }
)

/**
 * select the same points we are using for the map
 */
export const selectVesselDirectionPoints = createSelector(
  [getVesselParsedTrack, getDateRangeTS, selectFilterMode, selectFilterModeValues],
  (vesselTrack, dates, filterMode, values): VesselPoint[] => {
    return getTimebarPoints(vesselTrack, dates, filterMode, values)
  }
)

export const selectVesselDirectionsMinMaxValues = createSelector(
  [selectVesselDirectionPoints, selectTimebarMode],
  (vesselPoints, timebarMode) => {
    return vesselPoints.reduce(
      (acc, point) => ({
        min: Math.min(acc.min, point[timebarMode as keyof VesselPoint] as number),
        max: Math.max(acc.max, point[timebarMode as keyof VesselPoint] as number),
      }),
      { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
    )
  }
)

export const selectVesselDirectionsPositionScale = createSelector(
  [selectVesselDirectionsMinMaxValues],
  ({ min, max }) => {
    return max !== null && min !== null ? max - min : null
  }
)

export const selectRangeFilterLimits = createSelector(
  [selectVesselDirectionPoints],
  (vesselPoints) => {
    const limits = {
      speed: { min: 0, max: 15 },
      elevation: { min: -4000, max: 500 },
      distanceFromPort: { min: 0, max: 10000 },
      hours: { min: 0, max: 24 },
    }

    // Optimize min/max calculation for speed, elevation, and distanceFromPort in a single pass
    const initialLimits = {
      speed: { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
      elevation: { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
      distanceFromPort: { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
    }

    const combinedLimits = vesselPoints.reduce((acc, point) => {
      const speed = point.speed || 0
      const elevation = point.elevation || 0
      const distanceFromPort = point.distanceFromPort || 0

      acc.speed.min = Math.min(acc.speed.min, speed)
      acc.speed.max = Math.max(acc.speed.max, speed)

      acc.elevation.min = Math.min(acc.elevation.min, elevation)
      acc.elevation.max = Math.max(acc.elevation.max, elevation)

      acc.distanceFromPort.min = Math.min(acc.distanceFromPort.min, distanceFromPort)
      acc.distanceFromPort.max = Math.max(acc.distanceFromPort.max, distanceFromPort)

      return acc
    }, initialLimits)

    limits.speed = combinedLimits.speed
    limits.elevation = combinedLimits.elevation
    limits.distanceFromPort = combinedLimits.distanceFromPort

    return limits
  }
)
