import {
  HeatmapAnimatedGeneratorConfig,
  HeatmapAnimatedGeneratorCurrentsPOCConfig,
  HeatmapAnimatedGeneratorSublayer,
} from '../../types'
import { API_GATEWAY, API_GATEWAY_VERSION } from '../../../layer-composer'
import { API_ENDPOINTS } from '../config'
import { isUrlAbsolute } from '../../../utils'
import { TimeChunk } from './time-chunks'

export const toURLArray = (paramName: string, arr: string[]) => {
  return arr
    .map((element, i) => {
      if (!element) return ''
      return `${paramName}[${i}]=${element}`
    })
    .join('&')
}

export const getSourceId = (baseId: string, timeChunk: TimeChunk) => {
  return `${baseId}-${timeChunk.id}`
}

export const getLayerId = (baseId: string, timeChunk: TimeChunk, suffix = '') => {
  return `${getSourceId(baseId, timeChunk)}-${suffix}`
}

export const getTilesUrl = (
  config: HeatmapAnimatedGeneratorConfig | HeatmapAnimatedGeneratorCurrentsPOCConfig
): string => {
  if (config.tilesAPI) {
    return isUrlAbsolute(config.tilesAPI) ? config.tilesAPI : API_GATEWAY + config.tilesAPI
  }
  return `${API_GATEWAY}/${API_GATEWAY_VERSION}/${API_ENDPOINTS.tiles}`
}

export const getSubLayersDatasets = (sublayers: HeatmapAnimatedGeneratorSublayer[]): string[] => {
  return sublayers?.map((sublayer) => {
    const sublayerDatasets = [...sublayer.datasets]
    return sublayerDatasets.sort((a, b) => a.localeCompare(b)).join(',')
  })
}

export const getSubLayerVisible = (sublayer: HeatmapAnimatedGeneratorSublayer) =>
  sublayer.visible === false ? false : true
export const getSubLayersVisible = (sublayers: HeatmapAnimatedGeneratorSublayer[]) =>
  sublayers.map(getSubLayerVisible)

export const serializeBaseSourceParams = (params: any) => {
  const serialized = {
    ...params,
    singleFrame: params.singleFrame ? 'true' : 'false',
    filters: toURLArray('filters', params.filters),
    datasets: toURLArray('datasets', params.datasets),
    delta: params.delta.toString(),
    quantizeOffset: params.quantizeOffset.toString(),
    sublayerVisibility: JSON.stringify(params.sublayerVisibility),
    sublayerCount: params.sublayerCount.toString(),
    interactive: params.interactive ? 'true' : 'false',
  }
  if (params['date-range']) {
    serialized['date-range'] = params['date-range'].join(',')
  }
  if (params.sublayerBreaks) {
    serialized.sublayerBreaks = JSON.stringify(params.sublayerBreaks)
  }
  return serialized
}
