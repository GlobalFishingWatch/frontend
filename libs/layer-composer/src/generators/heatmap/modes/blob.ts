import { zip } from 'lodash'

import type { ExtendedLayerMeta } from '../../../types'
import type { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { getLayerId, getSourceId } from '../util'
import type { Breaks } from '../util/fetch-breaks'
import getBaseLayer from '../util/get-base-layers'
import getLegends, { getColorRampBaseExpression } from '../util/get-legends'
import type { TimeChunks} from '../util/time-chunks';
import { pickActiveTimeChunk } from '../util/time-chunks'

const baseBlobIntensity = 0.5
const baseBlobRadius = 30
const BASE_PAINT = {
  'heatmap-color': null, // set with color ramp
  'heatmap-weight': 1, // set with value picking
  'heatmap-radius': [
    'interpolate',
    ['exponential', 2],
    ['zoom'],
    0,
    baseBlobRadius,
    16,
    baseBlobRadius * 256,
  ],
  'heatmap-intensity': [
    'interpolate',
    ['exponential', 2],
    ['zoom'],
    0,
    baseBlobIntensity,
    16,
    16 * baseBlobIntensity,
  ],
  'heatmap-intensity-transition': {
    duration: 0,
    delay: 0,
  },
  // 'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 8, 1, 10, 0],
}

// Seems like MGL 'heatmap' layer types can be rendered more than once,
// so when using 'blob' type, we just use the 1st timechunk to render a single layer
// this will prevent buffering to happen, but whatever
const blob = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunks: TimeChunks,
  breaks: Breaks
) => {
  const { colorRamp } = getColorRampBaseExpression(config)
  const activeChunk = pickActiveTimeChunk(timeChunks)
  if (!activeChunk) return []
  const pickValueAt = activeChunk.frame.toString()
  const exprPick = ['coalesce', ['get', pickValueAt], 0]
  const paint = { ...BASE_PAINT }
  paint['heatmap-weight'] = exprPick as any
  const hStops = [0, 0.002, 0.004, 0.01, 0.05, 0.07, 0.1, 0.15, 0.2, 1]
  const heatmapColorRamp = zip(hStops, colorRamp).flat()
  paint['heatmap-color'] = [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    ...heatmapColorRamp,
  ] as any
  const BASE_BLOB_INTENSITY = 0.5
  const baseIntensity = BASE_BLOB_INTENSITY / Math.sqrt(Math.sqrt(timeChunks.deltaInDays))
  const maxIntensity = baseIntensity * 16
  paint['heatmap-intensity'][4] = baseIntensity
  paint['heatmap-intensity'][6] = maxIntensity

  const chunkMainLayer = getBaseLayer(
    config,
    getLayerId(config.id, activeChunk),
    getSourceId(config.id, activeChunk)
  )
  chunkMainLayer.paint = paint as any

  if (!chunkMainLayer.metadata) {
    return []
  }
  ;(chunkMainLayer.metadata as ExtendedLayerMeta).legend = getLegends(config, breaks)

  return [chunkMainLayer]
}

export default blob
