import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { TimeChunk } from './time-chunks'

export const toURLArray = (paramName: string, arr: string[]) => {
  return arr
    .map((element, i) => {
      if (!element) return ''
      return `${paramName}[${i}]=${element}`
    })
    .join('&')
}

export const getSourceId = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunk: TimeChunk) => {
  return `${config.id}-${timeChunk.id}`
}

export const getLayerId = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunk: TimeChunk,
  suffix = ''
) => {
  return `${getSourceId(config, timeChunk)}-${suffix}`
}
