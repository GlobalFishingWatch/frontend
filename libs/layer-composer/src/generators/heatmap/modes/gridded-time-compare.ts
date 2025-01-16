import type { FilterSpecification,LayerSpecification } from '@globalfishingwatch/maplibre-gl'

import type { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { getLayerId, getSourceId } from '../util'
import getBaseLayer, {
  getBaseDebugLabelsLayer,
  getBaseInteractionHoverLayer,
  getBaseInteractionLayer,
} from '../util/get-base-layers'
import { getColorRampBaseExpression } from '../util/get-legends'
import type { TimeChunks} from '../util/time-chunks';
import { pickActiveTimeChunk } from '../util/time-chunks'

export default function griddedTimeCompare(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunks: TimeChunks
) {
  const timeChunk = pickActiveTimeChunk(timeChunks)

  const mainLayer = getBaseLayer(
    config,
    getLayerId(config.id, timeChunk),
    getSourceId(config.id, timeChunk)
  )

  // TODO check red/blue to pos/negative delta, zero
  const { colorRampBaseExpression } = getColorRampBaseExpression(config)

  // TODO check
  const pickValueAt = timeChunk.frame.toString()
  // TODO Coalesce to 0 will not work if we use divergent scale (because we would need the value < min value)
  const exprPick: FilterSpecification = ['get', pickValueAt]

  const exprColorRamp = ['match', exprPick, ...colorRampBaseExpression, 'transparent']

  const paint = {
    'fill-color': exprColorRamp as any,
    'fill-outline-color': 'transparent',
  }
  mainLayer.paint = paint

  const layers: LayerSpecification[] = [mainLayer]
  if (config.interactive && timeChunk.active) {
    const interactionLayer = getBaseInteractionLayer(
      config,
      getLayerId(config.id, timeChunk, 'interaction'),
      mainLayer.source as string
    )
    layers.push(interactionLayer)
    const interactionHoverLayer = getBaseInteractionHoverLayer(
      config,
      getLayerId(config.id, timeChunk, 'interaction_hover'),
      mainLayer.source as string
    )
    layers.push(interactionHoverLayer)
  }
  if (config.debugLabels) {
    const debugTextLayer = getBaseDebugLabelsLayer(
      exprPick,
      getLayerId(config.id, timeChunk, 'debug_labels'),
      getSourceId(config.id, timeChunk)
    )
    layers.push(debugTextLayer)
  }

  return layers
}
