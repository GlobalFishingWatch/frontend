import { zip, flatten } from 'lodash'
import type {
  LayerSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
  DataDrivenPropertyValueSpecification,
  FormattedSpecification,
  ExpressionSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '../context/config'
import { GeneratorType, UserContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { Group } from '../../types'
import { API_GATEWAY } from '../../config'
import { HEATMAP_COLOR_RAMPS } from '../heatmap/colors'
import {
  getFillPaintWithFeatureState,
  getLinePaintWithFeatureState,
} from '../context/context.utils'

class UserContextGenerator {
  type = GeneratorType.UserContext

  _getStyleSources = (config: UserContextGeneratorConfig) => {
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl

    const url = new URL(tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}'))

    if (config.filter) {
      url.searchParams.set('filter', config.filter)
    }

    // As user can modify the dataset, we need to avoid the cache
    url.searchParams.set('cache', 'false')

    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: 'gfw_id',
        tiles: [decodeURI(url.toString())],
      },
    ]
  }

  _getStyleLayers = (config: UserContextGeneratorConfig): LayerSpecification[] => {
    const generatorId = config.id
    const baseLayer = {
      id: generatorId,
      source: config.id,
      'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
    }

    const interactive = !config.disableInteraction

    if (config.steps?.length && config.colorRamp) {
      const originalColorRamp = HEATMAP_COLOR_RAMPS[config.colorRamp]
      const legendRamp = zip(config.steps, originalColorRamp)
      const valueExpression: ExpressionSpecification = [
        'to-number',
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
          'fill-outline-color': 'transparent',
          'fill-color': colorRamp,
        },
        metadata: {
          color: config.color,
          interactive,
          generatorId,
          group: Group.CustomLayer,
          datasetId: config.datasetId,
          uniqueFeatureInteraction: true,
          legend: {
            type: 'colorramp',
            ...config.metadata?.legend,
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

  getStyle = (config: UserContextGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default UserContextGenerator
