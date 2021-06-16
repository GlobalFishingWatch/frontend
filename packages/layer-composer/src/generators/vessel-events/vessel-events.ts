import memoizeOne from 'memoize-one'
import { FeatureCollection } from 'geojson'
import type {
  CircleLayer,
  LineLayer,
  SymbolLayer,
  GeoJSONSourceRaw,
} from '@globalfishingwatch/mapbox-gl'
import { Group } from '../../types'
import { Type, VesselEventsGeneratorConfig, MergedGeneratorConfig } from '../types'
import { DEFAULT_LANDMASS_COLOR } from '../basemap/basemap-layers'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import {
  getVesselEventsGeojson,
  getVesselSegmentsGeojson,
  setActiveEvent,
} from './vessel-events.utils'

interface VesselsEventsSource extends GeoJSONSourceRaw {
  id: string
}

export type GlobalVesselEventsGeneratorConfig = MergedGeneratorConfig<VesselEventsGeneratorConfig>

const POINTS_TO_SEGMENTS_ZOOM_LEVEL_SWITCH = 6
const DEFAULT_STROKE_COLOR = 'rgba(0, 193, 231, 1)'

class VesselsEventsGenerator {
  type = Type.VesselEvents

  _getStyleSources = (config: GlobalVesselEventsGeneratorConfig): VesselsEventsSource[] => {
    const { id, data, track, start, end, currentEventId } = config

    if (!data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const geojson = memoizeCache[config.id].getVesselEventsGeojson(data) as FeatureCollection
    const newData: FeatureCollection = setActiveEvent(geojson, config.currentEventId || null)

    if (config.start && config.end) {
      const startMs = new Date(config.start).getTime()
      const endMs = new Date(config.end).getTime()
      newData.features = newData.features.filter((feature) => {
        return (
          feature.properties &&
          feature.properties.timestamp > startMs &&
          feature.properties.timestamp < endMs
        )
      })
    }

    const pointsSource: VesselsEventsSource = {
      id: `${id}_points`,
      type: 'geojson',
      data: newData,
    }

    if (!config.showTrackSegments) {
      return [pointsSource]
    }
    // TODO review performance memoization

    const segments = memoizeCache[config.id].getVesselSegmentsGeojson(
      track,
      data,
      start,
      end,
      currentEventId
    ) as FeatureCollection
    const segmentsSource: VesselsEventsSource = {
      id: `${id}_segments`,
      type: 'geojson',
      data: segments,
    }
    return [pointsSource, segmentsSource]
  }

  _getStyleLayers = (config: GlobalVesselEventsGeneratorConfig) => {
    if (!config.data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const activeFilter = ['case', ['==', ['get', 'active'], true]]

    const pointsLayers = [
      {
        id: `${config.id}_background`,
        type: 'circle',
        source: `${config.id}_points`,
        ...(config.showTrackSegments && { maxzoom: POINTS_TO_SEGMENTS_ZOOM_LEVEL_SWITCH }),
        paint: {
          'circle-color': ['get', 'color'],
          'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 2, 0, 8, 1, 14, 3],
          'circle-stroke-color': [
            ...activeFilter,
            config.color || DEFAULT_STROKE_COLOR,
            DEFAULT_LANDMASS_COLOR,
          ],
          'circle-radius': [...activeFilter, 8, 3],
        },
        metadata: {
          group: Group.Point,
          interactive: true,
          generatorId: config.id,
        },
      } as CircleLayer,
      {
        id: `${config.id}_outline`,
        source: `${config.id}_points`,
        ...(config.showTrackSegments && { maxzoom: POINTS_TO_SEGMENTS_ZOOM_LEVEL_SWITCH }),
        type: 'symbol',
        layout: {
          'icon-allow-overlap': true,
          'icon-image': ['get', 'icon'],
          'icon-size': [...activeFilter, 1, 0],
        },
        metadata: {
          group: Group.Point,
        },
      } as SymbolLayer,
    ]
    if (!config.showTrackSegments) {
      return pointsLayers
    }
    const segmentsLayers = [
      {
        id: `${config.id}_segments`,
        source: `${config.id}_segments`,
        type: 'line',
        minzoom: POINTS_TO_SEGMENTS_ZOOM_LEVEL_SWITCH,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'visible',
        },
        paint: {
          'line-color': 'white',
          'line-width': [...activeFilter, 6, 1.5],
          'line-opacity': 1,
        },
        metadata: {
          group: Group.TrackHighlighted,
          interactive: true,
          generatorId: config.id,
          uniqueFeatureInteraction: true,
        },
      } as LineLayer,
    ]
    return [...pointsLayers, ...segmentsLayers]
  }

  getStyle = (config: GlobalVesselEventsGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getVesselEventsGeojson: memoizeOne(getVesselEventsGeojson),
      getVesselSegmentsGeojson: memoizeOne(getVesselSegmentsGeojson),
    })

    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default VesselsEventsGenerator
