import { createSelector } from '@reduxjs/toolkit'
import { featureCollection } from '@turf/helpers'
import type { Feature, GeoJsonProperties, LineString, Point,Position } from 'geojson'

import { DataviewType, type TrackPoint } from '@globalfishingwatch/api-types'
import * as Generators from '@globalfishingwatch/layer-composer'

import { BACKGROUND_LAYER } from '../../data/config'
import type { Project } from '../../data/projects'
import { selectHighlightedEvent, selectHighlightedTime } from '../../features/timebar/timebar.slice'
import {
  getVesselParsedTrack,
  getVesselTrackGeojsonByDateRange,
} from '../../features/tracks/tracks.selectors'
import type { SelectedTrackType } from '../../features/vessels/selectedTracks.slice'
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import {
  getDateRangeTS,
  selectHiddenLabels,
  selectHiddenLayers,
  selectImportView,
  selectProject,
  selectProjectColors,
  selectSatellite,
  selectVessel,
} from '../../routes/routes.selectors'
import type { LayersData, TrackColor,VesselPoint } from '../../types'
import { ActionType } from '../../types'
import { getFixedColorForUnknownLabel } from '../../utils/colors'

/**
 * For each vessel segment filtered by the user, we return the layer config based on the actions
 */
export const getVesselParsedTrackLayer = createSelector(
  [
    getVesselTrackGeojsonByDateRange,
    getVesselParsedTrack,
    selectHighlightedTime,
    selectHighlightedEvent,
    selectProjectColors,
  ],
  (
    originalVesselTrack,
    vesselTrack,
    highlightedTime,
    highlightedEvent,
    projectColors
  ): Generators.TrackGeneratorConfig[] => {
    const features = vesselTrack.map((data: LayersData) => {
      return data.trackPoints.reduce(
        (feature, trackPoint) => {
          const coords = [trackPoint.longitude, trackPoint.latitude] as Position
          feature.geometry.coordinates.push(coords)
          feature.properties?.coordinateProperties?.times?.push(trackPoint.timestamp)
          feature.properties?.coordinateProperties?.speed?.push(trackPoint.speed)
          feature.properties?.coordinateProperties?.course?.push(trackPoint.course)
          feature.properties?.coordinateProperties?.elevation?.push(trackPoint.elevation)
          return feature
        },
        {
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
          type: 'Feature',
          properties: {
            action: data.action,
            coordinateProperties: {
              times: [],
              speed: [],
              course: [],
              elevation: [],
            },
          },
        } as Feature<LineString, GeoJsonProperties>
      )
    })
    const tracked = {
      id: 'vesselTrack',
      visible: true,
      data: featureCollection(features),
      type: Generators.GeneratorType.Track,
      simplify: false,
      highlightedEvent,
      highlightedTime,
      opacity: 1,
    } as Generators.TrackGeneratorConfig
    const untracked = {
      id: 'vesselTrack-untracked',
      visible: true,
      data: originalVesselTrack,
      type: Generators.GeneratorType.Track,
      simplify: false,
      highlightedTime,
      color: projectColors[ActionType.untracked],
    } as Generators.TrackGeneratorConfig
    return [tracked, untracked]
  }
)

// The selection of the colors is based in the following order
// 1. Colors defined in the code by label name
// 2. A list of defined colors taken by index
// 3. A random color
export const selectActionColors = createSelector(
  [selectProject, selectProjectColors],
  (project, colors): TrackColor => {
    project?.labels.forEach((label, index) => {
      if (!colors[label.id]) {
        colors[label.id] = getFixedColorForUnknownLabel(index)
      }
    })
    return colors
  }
)

export const getMapboxPaintIcon = createSelector(
  [selectActionColors, selectImportView, selectVessel],
  (colors: TrackColor): any[] => {
    const rules: any[] = []
    Object.keys(colors).forEach((key, index) => {
      rules.push(['==', ['get', 'action'], key])
      rules.push(colors[key])
    })

    return rules
  }
)

export const extractVesselDirectionPoints = (
  vesselTrack: LayersData[] | null,
  date: { start: number; end: number },
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
        date.start <= vesselMovement.timestamp &&
        date.end >= vesselMovement.timestamp &&
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

/**
 * We filter untracked points and return arrows with more data for the right visualization
 */
export const selectVesselDirectionPoints = createSelector(
  [getVesselTrackGeojsonByDateRange, getDateRangeTS, selectedtracks],
  (trackSegments, dates, selectedTracks) =>
    extractVesselDirectionPoints(
      [{ trackPoints: (trackSegments || [])?.flat(), action: ActionType.untracked }],
      dates,
      selectedTracks
    )
)

/**
 * We filter points and return arrows with more data for the right visualization
 */
export const selectVesselDirectionPointsOfSelectedSegments = createSelector(
  [getVesselParsedTrack, getDateRangeTS],
  (vesselTrack, date): VesselPoint[] => extractVesselDirectionPoints(vesselTrack, date, [])
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
    return [...originalArrows, ...arrows]
  }
)

/**
 * Using the custom Mapbox GL features, it return the layer needed to render arrows based on track points
 */
export const selectDirectionPointsLayers = createSelector(
  [selectVesselDirectionPointsLayer, selectHighlightedTime, selectHiddenLabels],
  (vesselEvents, highlightedTime, hiddenLabels): Generators.VesselPositionsGeneratorConfig => {
    return {
      id: 'vessel-positions',
      type: DataviewType.VesselPositions,
      data: {
        features: vesselEvents,
        type: 'FeatureCollection',
      },
      highlightedTime,
      hiddenLabels,
    }
  }
)

/**
 * Select the base layers that are not hidden by the user
 */
export const selectMapLayers = createSelector(
  [selectHiddenLayers, selectSatellite],
  (hiddenLayers, satellite) => {
    const dataviews: any = BACKGROUND_LAYER.map((dataview) => {
      return {
        ...dataview,
        basemap:
          dataview.type !== Generators.GeneratorType.Basemap
            ? dataview.type
            : satellite
            ? Generators.BasemapType.Satellite
            : Generators.BasemapType.Default,
        visible: !hiddenLayers.includes(dataview.id),
      }
    })
    return dataviews
  }
)

/**
 * Merge all the layers needed to render the map, except the direction arrows
 */
export const getLayerComposerLayers = createSelector(
  [selectMapLayers, getVesselParsedTrackLayer],
  (mapLayers, trackLayers) => {
    return [...mapLayers, ...trackLayers]
  }
)
