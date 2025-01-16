import { VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import type { FilterSpecification,LayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { Group } from '../../../types'
import { TEMPORALGRID_LAYER_INTERACTIVE_SUFIX, TEMPORALGRID_SOURCE_LAYER } from '../config'
import type { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { getLayerId, getSourceId } from '../util'
import type { Breaks } from '../util/fetch-breaks'
import getBaseLayer, {
  getBaseDebugLabelsLayer,
  getBaseInteractionHoverLayer,
  getBaseInteractionLayer,
} from '../util/get-base-layers'
import { getColorRampBaseExpression } from '../util/get-legends'
import type { TimeChunk, TimeChunks } from '../util/time-chunks'

export default function gridded(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunks: TimeChunks,
  breaks?: Breaks
) {
  const { colorRamp, colorRampBaseExpression } = getColorRampBaseExpression(config)

  // TODO only active chunk needed?
  const layers: LayerSpecification[] = timeChunks.chunks.flatMap((timeChunk: TimeChunk) => {
    // TODO Coalesce to 0 will not work if we use divergent scale (because we would need the value < min value)
    const pickValueAt = timeChunk.frame.toString()
    const exprPick: FilterSpecification = ['coalesce', ['get', pickValueAt], 0]

    const exprColorRamp =
      breaks && config.dynamicBreaks
        ? [
            'interpolate',
            ['linear'],
            // we'll need to minus the offset (TBD: 50 or from dataset) once we are ready for negative values
            // ['-', ['/', exprPick, VALUE_MULTIPLIER], 50],
            ['/', exprPick, VALUE_MULTIPLIER],
            ...colorRamp.flatMap((color, index) => {
              return [
                breaks[0][index - 1] !== undefined
                  ? breaks[0][index - 1]
                  : breaks[0][index] <= 0
                  ? breaks[0][index] - 1
                  : 0,
                color,
              ]
            }),
          ]
        : ['match', exprPick, ...colorRampBaseExpression, 'transparent']

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
        ? [
            'step',
            ['/', exprPick, VALUE_MULTIPLIER],
            ...minVisibleExpression,
            ...maxVisibleExpression,
            0,
          ]
        : []

    const paint = {
      'fill-color': timeChunk.active ? exprColorRamp : 'rgba(0,0,0,0)',
      'fill-outline-color': 'transparent',
      'fill-opacity': visibleValuesExpression?.length ? visibleValuesExpression : 1,
    }

    const chunkMainLayer = getBaseLayer(
      config,
      getLayerId(config.id, timeChunk),
      getSourceId(config.id, timeChunk)
    )
    chunkMainLayer.paint = paint as any
    // only add legend metadata for first time chunk
    const chunkLayers: LayerSpecification[] = [chunkMainLayer]

    if (config.interactive && timeChunk.active) {
      const interactionLayer = getBaseInteractionLayer(
        config,
        getLayerId(config.id, timeChunk, TEMPORALGRID_LAYER_INTERACTIVE_SUFIX),
        chunkMainLayer.source
      )

      chunkLayers.push(interactionLayer)
      const interactionHoverLayer = getBaseInteractionHoverLayer(
        config,
        getLayerId(config.id, timeChunk, `${TEMPORALGRID_LAYER_INTERACTIVE_SUFIX}_hover`),
        chunkMainLayer.source
      )
      chunkLayers.push(interactionHoverLayer)
    }

    if (config.debug) {
      const exprDebugOutline = ['case', ['>', exprPick, 0], 'rgba(0,255,0,1)', 'rgba(255,255,0,1)']
      chunkLayers.push({
        id: getLayerId(config.id, timeChunk, 'debug'),
        source: getSourceId(config.id, timeChunk),
        'source-layer': TEMPORALGRID_SOURCE_LAYER,
        type: 'fill',
        paint: {
          'fill-color': 'transparent',
          'fill-outline-color': exprDebugOutline as any,
        },
        metadata: {
          group: config.group || Group.Heatmap,
        },
      })
    }
    if (config.debugLabels) {
      const debugTextLayer = getBaseDebugLabelsLayer(
        exprPick,
        getLayerId(config.id, timeChunk, 'debug_labels'),
        getSourceId(config.id, timeChunk)
      )
      chunkLayers.push(debugTextLayer)
    }
    return chunkLayers
  })

  return layers
}
