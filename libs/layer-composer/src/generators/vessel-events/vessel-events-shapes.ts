import memoizeOne from 'memoize-one'
import { FeatureCollection } from 'geojson'
import type {
  LineLayerSpecification,
  SymbolLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { Group } from '../../types'
import {
  GeneratorType,
  VesselEventsGeneratorConfig,
  MergedGeneratorConfig,
  VesselsEventsSource,
} from '../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import {
  getVesselEventsGeojson,
  getVesselEventsSegmentsGeojson,
  filterGeojsonByTimerange,
  filterFeaturesByTimerange,
  getVesselEventsSegmentsGeojsonMemoizeEqualityCheck,
} from './vessel-events.utils'

export type GlobalVesselEventsGeneratorConfig = MergedGeneratorConfig<VesselEventsGeneratorConfig>

class VesselsEventsShapesGenerator {
  type = GeneratorType.VesselEventsShapes

  _showTrackSegments = (config: GlobalVesselEventsGeneratorConfig) => {
    return (
      config.track &&
      config.pointsToSegmentsSwitchLevel !== undefined &&
      Number.isFinite(config.pointsToSegmentsSwitchLevel) &&
      (config.zoom as number) >= config.pointsToSegmentsSwitchLevel
    )
  }

  _getStyleSources = (config: GlobalVesselEventsGeneratorConfig): VesselsEventsSource[] => {
    const { id, data, track, start, end, showAuthorizationStatus } = config
    const iconsPrefix = config.event?.iconsPrefix

    if (!data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const geojson = memoizeCache[config.id].getVesselEventsGeojson(
      data,
      showAuthorizationStatus,
      iconsPrefix,
      config.color
    ) as FeatureCollection

    const featuresFiltered = memoizeCache[config.id].filterFeaturesByTimerange(
      geojson.features,
      start,
      end
    )

    const pointsSource: VesselsEventsSource = {
      id: `${id}_points`,
      type: 'geojson',
      data: { ...geojson, features: featuresFiltered },
    }

    const showTrackSegments = this._showTrackSegments(config)

    if (!showTrackSegments) {
      return [pointsSource]
    }

    const segments = memoizeCache[config.id].getVesselEventsSegmentsGeojson(
      track,
      data,
      showAuthorizationStatus
    ) as FeatureCollection

    const segmentsFiltered = memoizeCache[config.id].filterGeojsonByTimerange(segments, start, end)

    const segmentsSource: VesselsEventsSource = {
      id: `${id}_segments`,
      type: 'geojson',
      data: segmentsFiltered,
    }
    return [pointsSource, segmentsSource]
  }

  _getStyleLayers = (config: GlobalVesselEventsGeneratorConfig) => {
    if (!config.data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }
    const showTrackSegments = this._showTrackSegments(config)

    const activeFilter = ['case', ['==', ['get', 'id'], config.currentEventId || null]]

    const pointsLayers: SymbolLayerSpecification[] = [
      {
        type: 'symbol',
        id: `${config.id}_points`,
        source: `${config.id}_points`,
        ...(showTrackSegments && { maxzoom: config.pointsToSegmentsSwitchLevel }),
        paint: {
          'icon-color': [...activeFilter, '#ffffff', ['get', 'color']],
          'icon-halo-color': config.color || '#ffffff',
          'icon-halo-width': [...activeFilter, 2, 0],
        },
        layout: {
          'icon-allow-overlap': true,
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4,
            [...activeFilter, ['*', 1.5, ['get', 'shapeSize']], ['get', 'shapeSize']],
            9,
            [...activeFilter, ['*', 3, ['get', 'shapeSize']], ['*', 2, ['get', 'shapeSize']]],
          ],
          'icon-image': ['get', 'shape'],
          'symbol-sort-key': ['get', 'shapePriority'],
        },
        metadata: {
          group: Group.Point,
          interactive: true,
          generatorId: config.id,
        },
      } as SymbolLayerSpecification,
    ]

    if (!showTrackSegments) {
      return pointsLayers
    }

    const segmentsLayers = [
      {
        id: `${config.id}_segments`,
        source: `${config.id}_segments`,
        type: 'line',
        minzoom: config.pointsToSegmentsSwitchLevel,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'visible',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': [...activeFilter, 6, 1.5],
          'line-opacity': 1,
        },
        metadata: {
          group: Group.TrackHighlighted,
          interactive: true,
          generatorId: config.id,
          uniqueFeatureInteraction: true,
        },
      } as LineLayerSpecification,
    ]
    return [...pointsLayers, ...segmentsLayers]
  }

  getStyle = (config: GlobalVesselEventsGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getVesselEventsGeojson: memoizeOne(getVesselEventsGeojson),
      getVesselEventsSegmentsGeojson: memoizeOne(
        getVesselEventsSegmentsGeojson,
        // This is a hack needed because the events array mutates constantly in resolve-dataviews-generators
        getVesselEventsSegmentsGeojsonMemoizeEqualityCheck
      ),
      filterGeojsonByTimerange: memoizeOne(filterGeojsonByTimerange),
      filterFeaturesByTimerange: memoizeOne(filterFeaturesByTimerange),
    })

    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default VesselsEventsShapesGenerator
