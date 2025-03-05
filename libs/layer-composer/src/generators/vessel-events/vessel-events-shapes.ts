import type { FeatureCollection } from 'geojson'
import memoizeOne from 'memoize-one'

import type {
  CircleLayerSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

import { Group } from '../../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import type {
  MergedGeneratorConfig,
  VesselEventsShapesGeneratorConfig,
  VesselsEventsSource} from '../types';
import {
  GeneratorType
} from '../types'

import {
  filterFeaturesByTimerange,
  filterGeojsonByTimerange,
  getVesselEventsGeojson,
  getVesselEventsGeojsonMemoizeEqualityCheck,
  getVesselEventsSegmentsGeojson,
  getVesselEventsSegmentsGeojsonMemoizeEqualityCheck,
  groupFeaturesByType,
} from './vessel-events.utils'

export type GlobalVesselEventsShapesGeneratorConfig =
  MergedGeneratorConfig<VesselEventsShapesGeneratorConfig>

class VesselsEventsShapesGenerator {
  type = GeneratorType.VesselEventsShapes

  _showTrackSegments = (config: GlobalVesselEventsShapesGeneratorConfig) => {
    return (
      config.track &&
      config.pointsToSegmentsSwitchLevel !== undefined &&
      Number.isFinite(config.pointsToSegmentsSwitchLevel) &&
      (config.zoom as number) >= config.pointsToSegmentsSwitchLevel
    )
  }

  _getStyleSources = (config: GlobalVesselEventsShapesGeneratorConfig): VesselsEventsSource[] => {
    const { id, data, track, start, end, showAuthorizationStatus } = config

    if (!data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const cachedData = memoizeCache[config.id].getCachedData(data)

    const geojson = memoizeCache[config.id].getVesselEventsGeojson(
      cachedData,
      showAuthorizationStatus,
      undefined,
      config.color,
      config.vesselId
    ) as FeatureCollection

    const featuresFiltered = memoizeCache[config.id].filterFeaturesByTimerange(
      geojson.features,
      start,
      end
    )

    const { fishing, other } = memoizeCache[config.id].groupFeaturesByType(featuresFiltered)

    const fishingEventsSource: VesselsEventsSource = {
      id: `${id}_fishingEvents`,
      type: 'geojson',
      data: { ...geojson, features: fishing },
    }

    const otherEventsSource: VesselsEventsSource = {
      id: `${id}_otherEvents`,
      type: 'geojson',
      data: { ...geojson, features: other },
    }

    const showTrackSegments = this._showTrackSegments(config)

    if (!showTrackSegments) {
      return [fishingEventsSource, otherEventsSource]
    }

    const segments = memoizeCache[config.id].getVesselEventsSegmentsGeojson(
      track,
      cachedData,
      showAuthorizationStatus,
      config.vesselId
    ) as FeatureCollection

    const fishingSegments = {
      ...segments,
      features: segments.features.filter((feature) => feature.properties?.type === 'fishing'),
    }

    const segmentsFiltered = memoizeCache[config.id].filterGeojsonByTimerange(
      fishingSegments,
      start,
      end
    )

    const segmentsSource: VesselsEventsSource = {
      id: `${id}_segments`,
      type: 'geojson',
      data: segmentsFiltered,
    }
    return [fishingEventsSource, otherEventsSource, segmentsSource]
  }

  _getStyleLayers = (config: GlobalVesselEventsShapesGeneratorConfig) => {
    if (!config.data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }
    const showTrackSegments = this._showTrackSegments(config)

    const getExpression = (highlighted: any, fallback: any) => {
      if (!config.currentEventsIds || !config.currentEventsIds.length) {
        return fallback
      }
      const filter = [
        'case',
        ['any', ...config.currentEventsIds.map((id: string) => ['==', ['get', 'id'], id])],
      ]
      const expr = [...filter, highlighted, fallback]
      return expr
    }

    const fishingPointsLayer: CircleLayerSpecification = {
      type: 'circle',
      id: `${config.id}_fishingEvents`,
      source: `${config.id}_fishingEvents`,
      layout: {
        'circle-sort-key': getExpression(1, 0),
      },
      paint: {
        'circle-color': ['get', 'color'],
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4,
          getExpression(4, 1.5),
          9,
          getExpression(7, 4),
        ],
        'circle-stroke-color': getExpression('#ffffff', 'transparent'),
        'circle-stroke-width': 2,
      },
      metadata: {
        group: Group.Point,
        interactive: true,
        generatorId: config.id,
      },
    } as CircleLayerSpecification

    const otherPointsLayer: SymbolLayerSpecification = {
      type: 'symbol',
      id: `${config.id}_otherEvents`,
      source: `${config.id}_otherEvents`,
      layout: {
        'icon-allow-overlap': true,
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4,
          getExpression(0.75, 0.5),
          9,
          getExpression(1, 0.75),
        ],
        'icon-image': getExpression(['get', 'shapeHighlight'], ['get', 'shape']),
        'symbol-sort-key': getExpression(
          ['*', 10, ['get', 'shapePriority']],
          ['get', 'shapePriority']
        ),
      },
      metadata: {
        group: Group.Point,
        interactive: true,
        generatorId: config.id,
      },
    } as SymbolLayerSpecification

    if (!showTrackSegments) {
      return [fishingPointsLayer, otherPointsLayer]
    }

    const fishingSegmentsLayer = {
      id: `${config.id}_segments`,
      source: `${config.id}_segments`,
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
        visibility: 'visible',
      },
      paint: {
        'line-color': getExpression('#ffffff', config.color),
        'line-width': ['get', 'width'],
        'line-opacity': 1,
      },
      metadata: {
        group: Group.TrackHighlighted,
        interactive: true,
        generatorId: config.id,
        uniqueFeatureInteraction: true,
      },
    } as LineLayerSpecification

    return [otherPointsLayer, fishingSegmentsLayer]
  }

  getStyle = (config: GlobalVesselEventsShapesGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getCachedData: memoizeOne(
        (data) => data,
        // Do not use shallow equality as data structures is generated on the fly in getGeneratorConfig
        (newArgs: any, lastArgs: any) => {
          return newArgs.length !== lastArgs.length
        }
      ),
      getVesselEventsGeojson: memoizeOne(
        getVesselEventsGeojson,
        getVesselEventsGeojsonMemoizeEqualityCheck
      ),
      getVesselEventsSegmentsGeojson: memoizeOne(
        getVesselEventsSegmentsGeojson,
        // This is a hack needed because the events array mutates constantly in resolve-dataviews-generators
        getVesselEventsSegmentsGeojsonMemoizeEqualityCheck
      ),
      filterGeojsonByTimerange: memoizeOne(filterGeojsonByTimerange),
      filterFeaturesByTimerange: memoizeOne(filterFeaturesByTimerange),
      groupFeaturesByType: memoizeOne(groupFeaturesByType),
    })

    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default VesselsEventsShapesGenerator
