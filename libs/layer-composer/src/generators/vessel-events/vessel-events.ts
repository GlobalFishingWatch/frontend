import type { FeatureCollection } from 'geojson'
import memoizeOne from 'memoize-one'

import type {
  CircleLayerSpecification,
  ColorSpecification,
  DataDrivenPropertyValueSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

import { Group } from '../../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { DEFAULT_LANDMASS_COLOR } from '../basemap/basemap-layers'
import type {
  MergedGeneratorConfig,
  VesselEventsGeneratorConfig,
  VesselsEventsSource} from '../types';
import {
  GeneratorType
} from '../types'

import {
  filterFeaturesByTimerange,
  filterGeojsonByTimerange,
  getVesselEventsGeojson,
  getVesselEventsSegmentsGeojson,
  getVesselEventsSegmentsGeojsonMemoizeEqualityCheck,
} from './vessel-events.utils'

export type GlobalVesselEventsGeneratorConfig = MergedGeneratorConfig<VesselEventsGeneratorConfig>

const DEFAULT_STROKE_COLOR = 'rgba(0, 193, 231, 1)'

class VesselsEventsGenerator {
  type = GeneratorType.VesselEvents

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
      iconsPrefix
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

    const { activeIconsSize, iconsSize, inactiveIconsSize, activeStrokeColor, strokeColor } = {
      activeIconsSize: 1,
      iconsSize: 1,
      inactiveIconsSize: 1,
      activeStrokeColor: config.color || DEFAULT_STROKE_COLOR,
      strokeColor: DEFAULT_LANDMASS_COLOR,
      ...config.event,
    }

    const activeFilter = ['case', ['==', ['get', 'id'], config.currentEventId || null]]

    const pointsLayers: (CircleLayerSpecification | SymbolLayerSpecification)[] = [
      {
        id: `${config.id}_background`,
        type: 'circle',
        source: `${config.id}_points`,
        ...(showTrackSegments && { maxzoom: config.pointsToSegmentsSwitchLevel }),
        paint: {
          'circle-color': ['get', 'color'],
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2,
            [...activeFilter, 2, 0],
            8,
            [...activeFilter, 2, 1],
            14,
            [...activeFilter, 2, 3],
          ],
          'circle-stroke-color': [
            ...activeFilter,
            activeStrokeColor,
            strokeColor,
          ] as DataDrivenPropertyValueSpecification<ColorSpecification>,
          'circle-radius': [
            ...activeFilter,
            8 * activeIconsSize,
            4 * inactiveIconsSize,
          ] as DataDrivenPropertyValueSpecification<number>,
        },
        layout: {
          'circle-sort-key': [
            ...activeFilter,
            1000,
            500,
          ] as DataDrivenPropertyValueSpecification<number>,
        },
        metadata: {
          group: Group.Point,
          interactive: true,
          generatorId: config.id,
        },
      } as CircleLayerSpecification,
    ]

    const showIcons = config.showIcons !== undefined ? config.showIcons : true
    if (showIcons) {
      pointsLayers.push({
        id: `${config.id}_outline`,
        source: `${config.id}_points`,
        ...(showTrackSegments && { maxzoom: config.pointsToSegmentsSwitchLevel }),
        type: 'symbol',
        layout: {
          'icon-allow-overlap': true,
          'icon-image': ['get', 'icon'],
          'icon-size': [
            ...activeFilter,
            1 * iconsSize,
            0,
          ] as DataDrivenPropertyValueSpecification<number>,
          'symbol-sort-key': [
            ...activeFilter,
            1000,
            500,
          ] as DataDrivenPropertyValueSpecification<number>,
        },
        metadata: {
          group: Group.Point,
        },
      } as SymbolLayerSpecification)
    }

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
          'line-width': [...activeFilter, 6, 1.5] as DataDrivenPropertyValueSpecification<number>,
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

export default VesselsEventsGenerator
