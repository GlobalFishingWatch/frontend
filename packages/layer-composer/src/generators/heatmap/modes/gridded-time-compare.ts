import { Layer, Expression } from '@globalfishingwatch/mapbox-gl'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBaseLayer, {
  getBaseDebugLabelsLayer,
  getBaseInteractionHoverLayer,
  getBaseInteractionLayer,
} from '../util/get-base-layers'
import { TimeChunks } from '../util/time-chunks'
import { getLayerId, getSourceId } from '../util'
import { getColorRampBaseExpression } from '../util/get-legends'

export default function griddedTimeCompare(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunks: TimeChunks
) {
  const timeChunk = timeChunks.chunks.find((t) => t.active) || timeChunks.chunks[0]

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
  const exprPick: Expression = ['get', pickValueAt]

  const exprColorRamp = ['match', exprPick, ...colorRampBaseExpression, 'transparent']

  const paint = {
    'fill-color': exprColorRamp as any,
    'fill-outline-color': 'transparent',
  }
  mainLayer.paint = paint

  const layers: Layer[] = [mainLayer]
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
