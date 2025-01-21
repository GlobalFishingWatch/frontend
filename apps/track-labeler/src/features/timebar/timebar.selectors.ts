import { createSelector } from 'reselect'

import type { Dataview , TrackPoint, TrackSegment } from '@globalfishingwatch/api-types'
import * as Generators from '@globalfishingwatch/layer-composer'

import { TimebarMode } from '../../data/config'
import { selectDataviews } from '../../features/dataviews/dataviews.slice'
import {
  getVesselFilteredTrackGeojsonByDateRange,
  getVesselParsedTrack,
  getVesselTrackData,
} from '../../features/tracks/tracks.selectors'
import { selectEvents } from '../../features/vessels/vessels.slice'
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

type TimebarTrackSegment = {
  start: number
  end: number
}
type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color?: string
}

const selectTracksDataviews = createSelector([selectDataviews], (dataviewWorkspaces) => {
  const dataviews: Dataview[] = dataviewWorkspaces.filter((dataviewWorkspace: Dataview) => {
    return (
      dataviewWorkspace.config.type === Generators.GeneratorType.Track &&
      dataviewWorkspace.config.visible !== false
    )
  })
  return dataviews
})

export const getTracksData = createSelector(
  [getVesselFilteredTrackGeojsonByDateRange],
  (tracks) => {
    if (tracks?.flat().length) {
      const tracksSegments: TimebarTrack[] = [
        {
          segments: tracks.map((segment: TrackSegment) => {
            return {
              start: segment[0].timestamp || 0,
              end: segment[segment.length - 1].timestamp || 0,
            }
          }),
          color: '#ffffff',
        },
      ]
      return tracksSegments
    }
    return []
  }
)

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

export const getEventsForTracks = createSelector(
  [selectTracksDataviews, selectEvents],
  (trackDataviews, events) => {
    const vesselsEvents = trackDataviews.map((dataviewWorkspace: Dataview) => {
      const id = dataviewWorkspace.id
      const vesselEvents = events[id] || []
      return vesselEvents
    })
    return vesselsEvents
  }
)

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

    if (vesselPoints.length > 0) {
      limits.speed = vesselPoints.reduce(
        (acc, point) => ({
          min: Math.min(acc.min, point.speed || 0),
          max: Math.max(acc.max, point.speed || 0),
        }),
        { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
      )

      limits.elevation = vesselPoints.reduce(
        (acc, point) => ({
          min: Math.min(acc.min, point.elevation || 0),
          max: Math.max(acc.max, point.elevation || 0),
        }),
        { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
      )

      limits.distanceFromPort = vesselPoints.reduce(
        (acc, point) => ({
          min: Math.min(acc.min, point.distanceFromPort || 0),
          max: Math.max(acc.max, point.distanceFromPort || 0),
        }),
        { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
      )
    }

    return limits
  }
)

