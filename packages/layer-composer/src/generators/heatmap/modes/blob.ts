import zip from 'lodash/zip'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { TimeChunks } from '../util/time-chunks'
import getLegends, { getColorRampBaseExpression } from '../util/get-legends'
import getBaseLayer from '../util/get-base-layer'

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
const blob = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunks) => {
  const { colorRamp } = getColorRampBaseExpression(config)
  const activeChunk = timeChunks.chunks.find((chunk) => chunk.active)
  if (!activeChunk) return []
  const pickValueAt = activeChunk.frame.toString()
  const exprPick = ['coalesce', ['get', pickValueAt], 0]

  const paint = { ...BASE_PAINT }
  paint['heatmap-weight'] = exprPick as any
  const hStops = [0, 0.005, 0.01, 0.1, 0.2, 1]
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

  const chunkMainLayer = getBaseLayer(config)
  chunkMainLayer.id = activeChunk.id
  chunkMainLayer.source = activeChunk.id
  chunkMainLayer.paint = paint as any

  if (!chunkMainLayer.metadata) return []
  chunkMainLayer.metadata.legend = getLegends(config, timeChunks.deltaInDays)

  return [chunkMainLayer]
}

export default blob
