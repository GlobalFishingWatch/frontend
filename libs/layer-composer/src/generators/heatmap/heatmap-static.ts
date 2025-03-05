import { VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import type { FilterSpecification } from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY, API_GATEWAY_VERSION } from '../../config'
import type { ExtendedLayerMeta} from '../../types';
import { Group } from '../../types'
import { isUrlAbsolute } from '../../utils'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '../context/config'
import type {
  ColorRampsIds,  HeatmapStaticGeneratorConfig,
  MergedGeneratorConfig} from '../types';
import {
  GeneratorType
} from '../types'
import { addURLSearchParams } from '../utils'

import { hoverInteractionPaint } from './util/get-base-layers'
import { getLegendsCompare } from './util/get-legends'
import { HEATMAP_COLOR_RAMPS } from './colors'
import { API_ENDPOINTS, HEATMAP_DEFAULT_MAX_ZOOM } from './config'

export type GlobalHeatmapStaticGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapStaticGeneratorConfig>
>

export const getHeatmapStaticSourceId = (id: string): string => {
  return `heatmap-static-${id}`
}

export const HEATMAP_STATIC_PROPERTY_ID = 'count'

const getTilesUrl = (config: HeatmapStaticGeneratorConfig): string => {
  if (config.tilesAPI) {
    return isUrlAbsolute(config.tilesAPI) ? config.tilesAPI : API_GATEWAY + config.tilesAPI
  }
  return `${API_GATEWAY}/${API_GATEWAY_VERSION}/${API_ENDPOINTS.tiles}`
}

const DEFAULT_CONFIG: Partial<HeatmapStaticGeneratorConfig> = {
  maxZoom: HEATMAP_DEFAULT_MAX_ZOOM,
  interactive: true,
  breaks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  breaksMultiplier: VALUE_MULTIPLIER,
}

class HeatmapStaticGenerator {
  type = GeneratorType.HeatmapStatic

  _getStyleSources = (config: GlobalHeatmapStaticGeneratorConfig) => {
    const tilesUrl = getTilesUrl(config)
    let url = new URL(tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}'))

    url.searchParams.set('temporal-aggregation', 'true')
    url.searchParams.set('format', 'MVT')
    url = addURLSearchParams(url, 'datasets', config.datasets)

    if (config.filters) {
      config.datasets.forEach((_, index) => {
        url.searchParams.set(`filters[${index}]`, config.filters)
      })
    }

    return [
      {
        id: getHeatmapStaticSourceId(config.id),
        type: 'vector',
        ...(config.maxZoom && { maxzoom: parseInt(config.maxZoom.toString()) }),
        tiles: [decodeURI(url.toString())],
      },
    ]
  }

  _getStyleLayers = (config: GlobalHeatmapStaticGeneratorConfig) => {
    const { breaks, colorRamp: colorRampId, visible } = config
    const sourceId = getHeatmapStaticSourceId(config.id)

    const exprPick: FilterSpecification = ['coalesce', ['get', HEATMAP_STATIC_PROPERTY_ID], 0]

    const useToWhiteRamp = config.totalHeatmapAnimatedGenerators === 1 && visible
    const finalColorRamp = useToWhiteRamp
      ? (`${colorRampId}_toWhite` as ColorRampsIds)
      : colorRampId
    const colorRamp = HEATMAP_COLOR_RAMPS[finalColorRamp] || HEATMAP_COLOR_RAMPS[colorRampId]

    const exprColorRamp = [
      'interpolate',
      ['linear'],
      // we'll need to minus the offset (TBD: 50 or from dataset) once we are ready for negative values
      // ['-', ['/', exprPick, VALUE_MULTIPLIER], 50],
      exprPick,
      ...colorRamp.flatMap((color, index) => {
        return breaks
          ? [
              breaks[index - 1] !== undefined
                ? breaks[index - 1]
                : breaks[index] <= 0
                ? breaks[index] - 1
                : 0,
              color,
            ]
          : []
      }),
    ]
    const visibilityOffset = 0.0000001
    const minVisibleExpression =
      config.minVisibleValue !== undefined && config.minVisibleValue !== config.maxVisibleValue
        ? [0, config.minVisibleValue - visibilityOffset, 1, config.minVisibleValue]
        : []
    const maxVisibleExpression =
      config.maxVisibleValue !== undefined && config.minVisibleValue !== config.maxVisibleValue
        ? [1, config.maxVisibleValue, 0, config.maxVisibleValue + visibilityOffset]
        : []
    const visibleValuesExpression =
      minVisibleExpression.length || maxVisibleExpression.length
        ? ['step', exprPick, ...minVisibleExpression, ...maxVisibleExpression, 0]
        : []

    const layers = [
      {
        id: sourceId,
        source: sourceId,
        'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
        type: 'fill',
        metadata: {
          group: Group.HeatmapStatic,
          generatorType: GeneratorType.HeatmapStatic,
          generatorId: config.id,
          interactive: true,
          static: true,
          uniqueFeatureInteraction: true,
        } as ExtendedLayerMeta,
        paint: {
          'fill-color': exprColorRamp,
          'fill-outline-color': 'transparent',
          'fill-opacity': visibleValuesExpression?.length ? visibleValuesExpression : 1,
        },
        layout: {
          visibility: visible,
        },
      },
      {
        id: sourceId + '_hover',
        source: sourceId,
        'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
        type: 'line',
        paint: hoverInteractionPaint,
        metadata: {
          interactive: false,
          group: config.group || Group.Heatmap,
        } as ExtendedLayerMeta,
      },
    ]

    return layers
  }

  getStyle = (generatorConfig: GlobalHeatmapStaticGeneratorConfig) => {
    const config = {
      ...DEFAULT_CONFIG,
      ...generatorConfig,
      breaks: generatorConfig.breaks || DEFAULT_CONFIG.breaks,
      metadata: generatorConfig.metadata,
    }
    const legends = getLegendsCompare(
      { ...config, sublayers: [config] } as any,
      [config.breaks] as any
    )
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
      metadata: {
        legends,
        group: config.group || Group.HeatmapStatic,
      },
    }
  }
}

export default HeatmapStaticGenerator
