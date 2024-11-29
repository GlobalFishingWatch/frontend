import type { ExtendedLayerMeta} from '../../../types';
import { Group } from '../../../types'
import { HEATMAP_COLOR_RAMPS } from '../colors'
import { TEMPORALGRID_SOURCE_LAYER } from '../config'
import type { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { getLayerId, getSourceId } from '../util'
import type { Breaks } from '../util/fetch-breaks'
import getBaseLayer from '../util/get-base-layers'
import getLegends from '../util/get-legends'
import type { TimeChunk, TimeChunks } from '../util/time-chunks'

function extruded(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunks: TimeChunks,
  breaks: Breaks
) {
  const layers: any[] = timeChunks.chunks.flatMap(
    (timeChunk: TimeChunk, timeChunkIndex: number) => {
      const chunkMainLayer = getBaseLayer(
        config,
        getLayerId(config.id, timeChunk),
        getSourceId(config.id, timeChunk)
      )
      chunkMainLayer.paint = {
        'fill-color': 'red',
        'fill-outline-color': 'transparent',
      }
      chunkMainLayer.metadata = {
        interactive: true,
        frame: timeChunk.frame,
      }

      // only add legend metadata for first time chunk
      if (timeChunkIndex === 0) {
        ;(chunkMainLayer.metadata as ExtendedLayerMeta).legend = getLegends(config, breaks)
      }

      const pickValueAt = timeChunk.frame.toString()

      const baseSlice = ['slice', ['get', pickValueAt]]
      const extrudedLayers = config.sublayers?.map((sublayer, sublayerIndex) => {
        const ramp = HEATMAP_COLOR_RAMPS[sublayer.colorRamp]
        const baseStartIndex = 6 * (sublayerIndex - 1)
        const heightStartIndex = 6 * sublayerIndex
        const heightEndIndex = 6 * (sublayerIndex + 1)
        const base =
          sublayerIndex === 0 ? 0 : ['to-number', [...baseSlice, baseStartIndex, heightStartIndex]]
        const height = ['to-number', [...baseSlice, heightStartIndex, heightEndIndex]]
        const sublayerLayer = {
          id: getLayerId(config.id, timeChunk, `debug_extrusion_${sublayerIndex}`),
          source: getSourceId(config.id, timeChunk),
          type: 'fill-extrusion',
          'source-layer': TEMPORALGRID_SOURCE_LAYER,
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

      if (config.debug) {
        const debugLayer = {
          id: getLayerId(config.id, timeChunk, 'debug_labels'),
          source: getSourceId(config.id, timeChunk),
          type: 'symbol',
          'source-layer': TEMPORALGRID_SOURCE_LAYER,
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
        return [...extrudedLayers, debugLayer]
      }

      return extrudedLayers
    }
  )
  return layers
}

export default extruded
