import { Layer } from '@globalfishingwatch/mapbox-gl'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBaseLayer, {
  getBaseInteractionHoverLayer,
  getBaseInteractionLayer,
} from '../util/get-base-layers'
import { TimeChunks } from '../util/time-chunks'
import { getLayerId, getSourceId } from '../util'
import { getColorRampBaseExpression } from '../util/get-legends'
import { BLEND_BACKGROUND } from '../util/colors'

export default function griddedTimeCompare(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunks: TimeChunks
) {
  const timeChunk = timeChunks.chunks.find((t) => t.active) || timeChunks.chunks[0]

  const mainLayer = getBaseLayer(config)
  mainLayer.id = getLayerId(config.id, timeChunk)
  mainLayer.source = getSourceId(config.id, timeChunk)

  // TODO adapt get-legends stuff to that
  // TODO check red/blue to pos/negative delta, zero
  // const { colorRampBaseExpression } = getColorRampBaseExpression(config)
  const colorRampBaseExpression = [
    0,
    '#3EF0FF',
    1,
    '#3DADDF',
    2,
    '#4286C1',
    3,
    '#3F69A4',
    4,
    BLEND_BACKGROUND,
    5,
    BLEND_BACKGROUND,
    6,
    '#4A4174',
    7,
    '#844A7F',
    8,
    '#B0547F',
    9,
    '#FF677D',
  ]

  // TODO check
  const pickValueAt = timeChunk.frame.toString()
  // TODO Coalesce to 0 will not work if we use divergent scale (because we would need the value < min value)
  const exprPick = ['coalesce', ['get', pickValueAt], 0]

  console.log(colorRampBaseExpression)

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
