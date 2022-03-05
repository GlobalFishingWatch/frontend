import memoizeOne from 'memoize-one'
import { FeatureCollection } from 'geojson'
import type {
  LineLayerSpecification,
  SymbolLayerSpecification,
  CircleLayerSpecification
} from '@globalfishingwatch/maplibre-gl'
import { Group } from '../../types'
import {
  GeneratorType,
  VesselEventsShapesGeneratorConfig,
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
  groupFeaturesByType
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

    const geojson = memoizeCache[config.id].getVesselEventsGeojson(
      data,
      showAuthorizationStatus,
      null,
      config.color
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
      data,
      showAuthorizationStatus
    ) as FeatureCollection

    const segmentsFiltered = memoizeCache[config.id].filterGeojsonByTimerange(segments, start, end)

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

    const pointsLayers: (CircleLayerSpecification | SymbolLayerSpecification)[] = [
      {
        type: 'circle',
        id: `${config.id}_fishingEvents`,
        source: `${config.id}_fishingEvents`,
        ...(showTrackSegments && { maxzoom: config.pointsToSegmentsSwitchLevel }),
        paint: {
          'circle-color': getExpression('#ffffff', ['get', 'color']),
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4,
            getExpression(5, 3),
            9,
            getExpression(10, 6),
          ],
        },
        metadata: {
          group: Group.Point,
          interactive: true,
          generatorId: config.id,
        },
      } as CircleLayerSpecification,
      {
        type: 'symbol',
        id: `${config.id}_otherEvents`,
        source: `${config.id}_otherEvents`,
        ...(showTrackSegments && { maxzoom: config.pointsToSegmentsSwitchLevel }),
        layout: {
          'icon-allow-overlap': true,
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4,
            getExpression(0.75, 0.5),
            9,
            getExpression(1.5, 1),
          ],
          'icon-image': getExpression(['get', 'shapeHighlight'], ['get', 'shape']),
          'symbol-sort-key': ['get', 'shapePriority'],
        },
        metadata: {
          group: Group.Point,
          interactive: true,
          generatorId: config.id,
        },
      } as SymbolLayerSpecification
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
          'line-width': getExpression(6, 1.5),
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

  getStyle = (config: GlobalVesselEventsShapesGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getVesselEventsGeojson: memoizeOne(getVesselEventsGeojson),
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
