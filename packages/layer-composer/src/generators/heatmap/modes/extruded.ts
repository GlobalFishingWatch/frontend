import { Group } from '../../../types'
import { HEATMAP_COLOR_RAMPS } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBaseLayer from '../util/get-base-layer'
import { TimeChunk, toQuantizedFrame } from '../util/time-chunks'

export default function (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunk[]) {
  const layers: any[] = timeChunks.flatMap((timeChunk: TimeChunk, timeChunkIndex: number) => {
    const chunkMainLayer = getBaseLayer(config)
    const frame = toQuantizedFrame(config.start, timeChunk.quantizeOffset, timeChunk.interval)
    chunkMainLayer.id = timeChunk.id
    chunkMainLayer.source = timeChunk.id
    chunkMainLayer.paint = {
      'fill-color': 'red',
      'fill-outline-color': 'transparent',
    }
    ;(chunkMainLayer as any).metadata = {
      interactive: true,
      frame,
    }

    const pickValueAt = frame.toString()
    const debugLayer = {
      id: `${timeChunk.id}_debug_labels`,
      type: 'symbol',
      source: timeChunk.id,
      'source-layer': 'temporalgrid',
      layout: {
        'text-field': ['to-string', ['*', ['to-number', ['slice', ['get', pickValueAt], 0, 4]], 1]],
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
    }

    const baseSlice = ['slice', ['get', pickValueAt]]
    const extrudedLayers = config.sublayers.map((sublayer, sublayerIndex) => {
      const ramp = HEATMAP_COLOR_RAMPS[sublayer.colorRamp]
      const baseStartIndex = 4 * (sublayerIndex - 1)
      const heightStartIndex = 4 * sublayerIndex
      const heightEndIndex = 4 * (sublayerIndex + 1)
      const base =
        sublayerIndex === 0 ? 0 : ['to-number', [...baseSlice, baseStartIndex, heightStartIndex]]
      const height = ['to-number', [...baseSlice, heightStartIndex, heightEndIndex]]
      const sublayerLayer = {
        id: `${timeChunk.id}_debug_extrusion${sublayerIndex}`,
        type: 'fill-extrusion',
        source: timeChunk.id,
        'source-layer': 'temporalgrid',
        paint: {
          'fill-extrusion-color': ramp[ramp.length - 1],
          'fill-extrusion-base': ['*', base, 500],
          'fill-extrusion-height': ['*', height, 500],
          'fill-extrusion-opacity': 0.9,
        },
        filter: ['!=', base, height],
      }
      return sublayerLayer
    })

    return [...extrudedLayers]
  })
  return layers
}
