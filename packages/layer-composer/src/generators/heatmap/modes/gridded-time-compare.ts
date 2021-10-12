import { Layer } from '@globalfishingwatch/mapbox-gl'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBaseLayer, {
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

  const mainLayer = getBaseLayer(config)
  mainLayer.id = getLayerId(config.id, timeChunk)
  mainLayer.source = getSourceId(config.id, timeChunk)

  // TODO check red/blue to pos/negative delta, zero
  const { colorRampBaseExpression } = getColorRampBaseExpression(config)

  // TODO check
  const pickValueAt = timeChunk.frame.toString()
  // TODO Coalesce to 0 will not work if we use divergent scale (because we would need the value < min value)
  const exprPick = ['coalesce', ['get', pickValueAt], 0]

  const exprColorRamp = ['match', exprPick, ...colorRampBaseExpression, 'transparent']

  const paint = {
    // 'fill-color': timeChunk.active ? (exprColorRamp as any) : 'rgba(0,0,0,0)',
    'fill-color': exprColorRamp as any,
    'fill-outline-color': 'transparent',
  }
  mainLayer.paint = paint

  const layers: Layer[] = [mainLayer]
  if (config.interactive && timeChunk.active) {
    const interactionLayer = getBaseInteractionLayer(config)
    interactionLayer.id = getLayerId(config.id, timeChunk, 'interaction')
    interactionLayer.source = mainLayer.source
    layers.push(interactionLayer)
    const interactionHoverLayer = getBaseInteractionHoverLayer(config)
    interactionHoverLayer.id = getLayerId(config.id, timeChunk, 'interaction_hover')
    interactionHoverLayer.source = mainLayer.source
    layers.push(interactionHoverLayer)
  }

  return layers
}
