import { Group } from '../../../types'
import { HEATMAP_COLOR_RAMPS } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBaseLayer from '../util/get-base-layer'
import { TimeChunk, TimeChunks } from '../util/time-chunks'

function extruded(config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunks) {
  const layers: any[] = timeChunks.chunks.flatMap(
    (timeChunk: TimeChunk, timeChunkIndex: number) => {
      const chunkMainLayer = getBaseLayer(config)
      // TODO proper layer/src ids
      chunkMainLayer.id = timeChunk.id
      chunkMainLayer.source = timeChunk.id
      chunkMainLayer.paint = {
        'fill-color': 'red',
        'fill-outline-color': 'transparent',
      }
      ;(chunkMainLayer as any).metadata = {
        interactive: true,
        frame: timeChunk.frame,
      }

      const pickValueAt = timeChunk.frame.toString()
      const debugLayer = {
        id: `${timeChunk.id}_debug_labels`,
        type: 'symbol',
        source: timeChunk.id,
        'source-layer': 'temporalgrid',
        layout: {
          'text-field': [
            'to-string',
            ['*', ['to-number', ['slice', ['get', pickValueAt], 0, 6]], 1],
          ],
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
        const baseStartIndex = 6 * (sublayerIndex - 1)
        const heightStartIndex = 6 * sublayerIndex
        const heightEndIndex = 6 * (sublayerIndex + 1)
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
            'fill-extrusion-base': ['*', base, 50],
            'fill-extrusion-height': ['*', height, 50],
            'fill-extrusion-opacity': timeChunk.active ? 0.9 : 0,
          },
          filter: ['!=', base, height],
        }
        return sublayerLayer
      })

      return [...extrudedLayers]
    }
  )
  return layers
}

export default extruded
