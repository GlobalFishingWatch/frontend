import { flatten,zip } from 'lodash'

import type {
  DataDrivenPropertyValueSpecification,
  ExpressionSpecification,
  FillLayerSpecification,
  FormattedSpecification,
  LayerSpecification,
  LineLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY } from '../../config'
import { Group } from '../../types'
import { isUrlAbsolute } from '../../utils'
import {
  DEFAULT_CONTEXT_MAX_ZOOM,
  DEFAULT_CONTEXT_PROMOTE_ID,
  DEFAULT_CONTEXT_SOURCE_LAYER,
} from '../context/config'
import {
  getFillPaintWithFeatureState,
  getLinePaintWithFeatureState,
} from '../context/context.utils'
import { getColorRampByOpacitySteps } from '../heatmap/util/colors'
import type { GlobalUserContextGeneratorConfig } from '../types';
import { GeneratorType } from '../types'
import { getTimeFilterForUserContextLayer } from '../utils'

class UserContextGenerator {
  type = GeneratorType.UserContext

  _getStyleSources = (config: GlobalUserContextGeneratorConfig) => {
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl

    const url = new URL(tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}'))

    if (config.filter) {
      url.searchParams.set('filter', config.filter)
    }

    // Needed for invalidate caches on user changes
    const properties = [
      ...(config.valueProperties || []),
      config.pickValueAt || '',
      config.startTimeFilterProperty || '',
      config.endTimeFilterProperty || '',
    ].filter((p) => !!p)
    if (properties.length) {
      properties.forEach((property, index) => {
        url.searchParams.set(`properties[${index}]`, property)
      })
    }

    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: config.promoteId || DEFAULT_CONTEXT_PROMOTE_ID,
        maxzoom: config.maxzoom || DEFAULT_CONTEXT_MAX_ZOOM,
        tiles: [decodeURI(url.toString())],
      },
    ]
  }

  _getStyleLayers = (config: GlobalUserContextGeneratorConfig): LayerSpecification[] => {
    const generatorId = config.id
    const baseLayer = {
      id: generatorId,
      source: config.id,
      'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
    }

    const interactive = !config.disableInteraction

    const filters = getTimeFilterForUserContextLayer(config)
    if (config.steps?.length) {
      const generatedRamp = getColorRampByOpacitySteps(config.color, config.steps?.length)
      const legendRamp = zip(config.steps, generatedRamp)
      const valueExpression: ExpressionSpecification = [
        'to-number',
        // feature properties are set as lowercase on the backend
        ['get', config.pickValueAt || 'value'],
      ]
      const colorRamp: DataDrivenPropertyValueSpecification<FormattedSpecification> = [
        'interpolate',
        ['linear'],
        valueExpression,
        ...(flatten(legendRamp) as any),
      ]
      const stepsLayer: FillLayerSpecification = {
        ...baseLayer,
        type: 'fill' as const,
        paint: {
          'fill-outline-color': generatedRamp[generatedRamp.length - 1] || 'transparent',
          'fill-color': colorRamp,
          'fill-antialias': true,
        },
        ...(filters && { filter: filters }),
        metadata: {
          color: config.color,
          interactive,
          generatorId,
          group: Group.CustomLayer,
          datasetId: config.datasetId,
          uniqueFeatureInteraction: true,
          valueProperties: config.valueProperties,
          legend: {
            type: 'colorramp',
            ...config.metadata?.legend,
            unit: config.pickValueAt,
            ramp: legendRamp,
          },
        },
      }
      return [stepsLayer]
    }

    const lineLayer: LineLayerSpecification = {
      ...baseLayer,
      type: 'line',
      paint: {
        'line-width': 1,
        ...getLinePaintWithFeatureState(config.color),
      },
      ...(filters && { filter: filters }),
      metadata: {
        color: config.color,
        interactive: false,
        generatorId,
      },
    }

    const interactionLayer: FillLayerSpecification = {
      ...baseLayer,
      id: `${generatorId}_interaction`,
      type: 'fill',
      paint: {
        'fill-outline-color': 'transparent',
        ...getFillPaintWithFeatureState('transparent'),
      },
      ...(filters && { filter: filters }),
      metadata: {
        interactive,
        generatorId: generatorId,
        datasetId: config.datasetId,
        valueProperties: config.valueProperties,
        group: Group.OutlinePolygonsBackground,
      },
    }
    return [lineLayer, interactionLayer]
  }

  getStyle = (config: GlobalUserContextGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default UserContextGenerator
