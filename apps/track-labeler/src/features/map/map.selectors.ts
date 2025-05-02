import { createSelector } from '@reduxjs/toolkit'
import type { Feature, GeoJsonProperties, Point } from 'geojson'

import { type TrackPoint } from '@globalfishingwatch/api-types'
import type { TrackLabelerPoint } from '@globalfishingwatch/deck-layers'

import type { Project } from '../../data/projects'
import {
  getVesselParsedTrack,
  getVesselTrackGeojsonByDateRange,
} from '../../features/tracks/tracks.selectors'
import type { SelectedTrackType } from '../../features/vessels/selectedTracks.slice'
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import { getDateRangeTS, selectProject, selectProjectColors } from '../../routes/routes.selectors'
import type { LayersData, VesselPoint } from '../../types'
import { ActionType } from '../../types'

export const extractVesselDirectionPoints = (
  vesselTrack: LayersData[] | null,
  selectedtracks?: SelectedTrackType[]
): VesselPoint[] => {
  if (!vesselTrack) {
    return []
  }
  const eventsWithRenderingInfo: VesselPoint[] = vesselTrack.flatMap((data: LayersData) => {
    const events = (data.trackPoints ?? []).filter((vesselMovement) => {
      if (
        vesselMovement !== null &&
        vesselMovement.timestamp &&
        vesselMovement.course !== undefined &&
        vesselMovement.course !== null
      ) {
        return (
          !selectedtracks ||
          !selectedtracks.some((selectedSegment) => {
            return (
              selectedSegment &&
              selectedSegment.start &&
              selectedSegment.end &&
              vesselMovement.timestamp &&
              selectedSegment.start <= vesselMovement.timestamp &&
              selectedSegment.end >= vesselMovement.timestamp
            )
          })
        )
      } else {
        return false
      }
    })
    return events.map((vesselMovement: TrackPoint) => {
      return {
        timestamp: vesselMovement.timestamp,
        speed: vesselMovement.speed,
        fishing: false,
        course: vesselMovement.course,
        elevation: vesselMovement.elevation,
        action: data.action || ActionType.untracked,
        position: { lat: vesselMovement.latitude, lon: vesselMovement.longitude },
      } as VesselPoint
    })
  })
  return eventsWithRenderingInfo
}

export const extractVesselDirectionPointsByDateRange = (
  vesselTrack: VesselPoint[] | null,
  { start, end }: { start: number; end: number }
): VesselPoint[] => {
  if (!vesselTrack) {
    return []
  }
  return vesselTrack.filter((data) => {
    return data.timestamp >= start && data.timestamp <= end
  })
}
export const selectAllVesselDirectionPoints = createSelector(
  [getVesselTrackGeojsonByDateRange, selectedtracks],
  (trackSegments, selectedTracks) => {
    return extractVesselDirectionPoints(
      [{ trackPoints: (trackSegments || [])?.flat(), action: ActionType.untracked }],
      selectedTracks
    )
  }
)

/**
 * We filter untracked points and return arrows with more data for the right visualization
 */
export const selectVesselDirectionPoints = createSelector(
  [selectAllVesselDirectionPoints, getDateRangeTS],
  (points, dates) => {
    return extractVesselDirectionPointsByDateRange(points, dates)
  }
)

export const selectAllVesselDirectionPointsOfSelectedSegments = createSelector(
  [getVesselParsedTrack],
  (vesselTrack): VesselPoint[] => extractVesselDirectionPoints(vesselTrack, [])
)

/**
 * We filter points and return arrows with more data for the right visualization
 */
export const selectVesselDirectionPointsOfSelectedSegments = createSelector(
  [selectAllVesselDirectionPointsOfSelectedSegments, getDateRangeTS],
  (points, date): VesselPoint[] => extractVesselDirectionPointsByDateRange(points, date)
)

/**
 * Get the list of visible labels for the actual project
 */
export const selectLegendLabels = createSelector(
  [selectProject, selectProjectColors],
  (project: Project | null, projectColors) => {
    const labels =
      project?.labels.map((label) => {
        return {
          ...label,
          color: projectColors[label.id as ActionType],
        }
      }) || []
    labels.push({
      id: ActionType.selected,
      name: ActionType.selected,
      color: projectColors[ActionType.selected],
    })
    labels.push({
      id: ActionType.untracked,
      name: ActionType.untracked,
      color: projectColors[ActionType.untracked],
    })
    return labels
  }
)

/**
 * Creates a custom features for the arrows
 */
export const selectVesselDirectionPointsLayer = createSelector(
  [selectVesselDirectionPoints, selectVesselDirectionPointsOfSelectedSegments],
  (originalVesselTrack, vesselTrack): Feature[] => {
    const originalArrows: Feature[] = originalVesselTrack.map((point: VesselPoint) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.position.lon, point.position.lat],
        },
        properties: {
          timestamp: point.timestamp,
          speed: point.speed,
          course: point.course,
          elevation: point.elevation,
          action: point.action,
        },
      } as Feature<Point, GeoJsonProperties>
    })
    const arrows: Feature<Point, GeoJsonProperties>[] = vesselTrack.map((point: VesselPoint) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.position.lon, point.position.lat],
        },
        properties: {
          timestamp: point.timestamp,
          speed: point.speed,
          course: point.course,
          elevation: point.elevation,
          action: point.action,
        },
      } as Feature<Point, GeoJsonProperties>
    })
    return [...originalArrows, ...arrows].sort(
      (a, b) => a.properties?.timestamp - b.properties?.timestamp
    )
  }
)

const emptyValue: TrackLabelerPoint[] = []
export const selectDirectionPointsData = createSelector(
  [selectVesselDirectionPointsLayer, selectProjectColors],
  (vesselEvents, projectColors) => {
    if (!vesselEvents || vesselEvents.length === 0) {
      return emptyValue
    }
    const extractedPoints: TrackLabelerPoint[] = []
    vesselEvents.forEach((feature) => {
      if (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
        const coords = feature.geometry.coordinates
        const props = feature.properties || {}

        extractedPoints.push({
          position: coords,
          timestamp: props.timestamp,
          speed: props.speed || 0,
          course: props.course || 0,
          action: props.action || 'unknown',
          color: projectColors[props.action] || '#ff0000',
        })
      }
    })
    return extractedPoints
  }
)
