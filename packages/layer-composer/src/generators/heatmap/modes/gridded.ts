import { Layer } from 'mapbox-gl'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { TimeChunk, toQuantizedFrame } from '../util/time-chunks'
import { Group } from '../../../types'
import { Type } from '../../types'
import getLegends, { getColorRampBaseExpression } from '../util/get-legends'
import getBaseLayer from '../util/get-base-layer'

export default function (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunk[]) {
  const intervalInDays = timeChunks[0].intervalInDays
  const { colorRampBaseExpression } = getColorRampBaseExpression(config)
  const layers: Layer[] = timeChunks.flatMap((timeChunk: TimeChunk, timeChunkIndex: number) => {
    const frame = toQuantizedFrame(config.start, timeChunk.quantizeOffset, timeChunk.interval)
    const pickValueAt = frame.toString()
    const exprPick = ['coalesce', ['get', pickValueAt], 0]
    const exprColorRamp = ['step', exprPick, 'transparent', ...colorRampBaseExpression]

    const paint = {
      'fill-color': exprColorRamp as any,
      'fill-outline-color': 'transparent',
    }

    const chunkMainLayer = getBaseLayer(config)
    chunkMainLayer.id = timeChunk.id
    chunkMainLayer.source = timeChunk.id
    chunkMainLayer.paint = paint
    // only add legend metadata for first time chunk
    if (timeChunkIndex === 0 && chunkMainLayer.metadata) {
      chunkMainLayer.metadata.legend = getLegends(config, intervalInDays)
    }
    const chunkLayers: Layer[] = [chunkMainLayer]

    if (config.interactive) {
      chunkLayers.push({
        id: `${timeChunk.id}_interaction`,
        source: timeChunk.id,
        'source-layer': 'temporalgrid_interactive',
        type: 'fill',
        paint: {
          'fill-color': 'pink',
          'fill-opacity': config.debug ? 0.5 : 0.1,
        },
        metadata: {
          group: Group.Heatmap,
          generatorType: Type.HeatmapAnimated,
          generatorId: config.id,
          interactive: true,
          frame,
        },
      })
      chunkLayers.push({
        id: `${timeChunk.id}_interaction_hover`,
        source: timeChunk.id,
        'source-layer': 'temporalgrid_interactive',
        type: 'line',
        paint: {
          'line-color': 'white',
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 0],
        },
        metadata: {
          group: Group.Heatmap,
        },
      })
    }

    if (config.debug) {
      const exprDebugOutline = ['case', ['>', exprPick, 0], 'rgba(0,255,0,1)', 'rgba(255,255,0,1)']
      chunkLayers.push({
        id: `${timeChunk.id}_debug`,
        source: timeChunk.id,
        'source-layer': 'temporalgrid',
        type: 'fill',
        paint: {
          'fill-color': 'transparent',
          'fill-outline-color': exprDebugOutline as any,
        },
        metadata: {
          group: Group.Heatmap,
        },
      })
    }
    if (config.debugLabels) {
      const exprDebugText = ['case', ['>', exprPick, 0], ['to-string', exprPick], '']
      chunkLayers.push({
        id: `${timeChunk.id}_debug_labels`,
        type: 'symbol',
        source: timeChunk.id,
        'source-layer': 'temporalgrid',
        layout: {
          'text-field': exprDebugText as any,
          'text-font': ['Roboto Mono Light'],
          'text-size': 8,
          'text-allow-overlap': true,
        },
        paint: {
          'text-halo-color': 'hsl(320, 0%, 100%)',
          'text-halo-width': 2,
        },
        metadata: {
          group: Group.Label,
        },
      })
    }
    return chunkLayers
  })

  return layers
}
