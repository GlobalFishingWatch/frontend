import { createSelector } from 'reselect'
import { Dataview } from '@globalfishingwatch/api-types'
import * as Generators from '@globalfishingwatch/layer-composer'
import { TrackPoint, TrackSegment } from '@globalfishingwatch/api-types'
import { selectDataviews } from '../../features/dataviews/dataviews.slice'
import { selectEvents } from '../../features/vessels/vessels.slice'
import { getDateRangeTS, selectTimebarMode } from '../../routes/routes.selectors'
import {
  getVesselFilteredTrackGeojsonByDateRange,
  getVesselParsedFilteredTrack,
  getVesselTrackData,
} from '../../features/tracks/tracks.selectors'
import { DayNightLayer, VesselPoint } from '../../types'
import { TimebarMode } from '../../data/config'
import { extractVesselDirectionPoints } from '../../features/map/map.selectors'

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

/**
 * select the same points we are using for the map
 */
export const selectVesselDirectionPoints = createSelector(
  [getVesselParsedFilteredTrack, getDateRangeTS],
  (vesselTrack, dates): VesselPoint[] => extractVesselDirectionPoints(vesselTrack, dates, [])
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