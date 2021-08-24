import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import { ColorRampsIds, HeatmapAnimatedMode } from '../types'
import { getColorRampByOpacitySteps, getMixedOpacityToWhiteColorRamp } from './util/colors'

export const API_ENDPOINTS = {
  tiles: '4wings/tile/heatmap/{z}/{x}/{y}',
  breaks: '4wings/bins/{zoom}',
  statistics: '4wings/statistics',
}

export const HEATMAP_DEFAULT_MAX_ZOOM = 12

export const HEATMAP_MODE_COMBINATION: Record<HeatmapAnimatedMode, SublayerCombinationMode> = {
  [HeatmapAnimatedMode.Single]: SublayerCombinationMode.None,
  [HeatmapAnimatedMode.Compare]: SublayerCombinationMode.Max,
  [HeatmapAnimatedMode.Bivariate]: SublayerCombinationMode.Bivariate,
  [HeatmapAnimatedMode.Blob]: SublayerCombinationMode.Literal,
  [HeatmapAnimatedMode.Extruded]: SublayerCombinationMode.Cumulative,
  [HeatmapAnimatedMode.Currents__POC]: SublayerCombinationMode.Currents__POC,
}

export const HEATMAP_MODE_LAYER_TYPE: Record<HeatmapAnimatedMode, string> = {
  [HeatmapAnimatedMode.Single]: 'fill',
  [HeatmapAnimatedMode.Compare]: 'fill',
  [HeatmapAnimatedMode.Bivariate]: 'fill',
  [HeatmapAnimatedMode.Blob]: 'heatmap',
  [HeatmapAnimatedMode.Extruded]: 'fill-extrusion',
  [HeatmapAnimatedMode.Currents__POC]: 'circle',
}

export const GRID_AREA_BY_ZOOM_LEVEL = [
  128000000000, 32000000000, 8000000000, 2000000000, 500000000, 120000000, 31000000, 8000000,
  2000000, 500000, 125000, 30000, 7500,
]

export const HEATMAP_COLORS_BY_ID = {
  teal: '#00FFBC',
  magenta: '#FF64CE',
  lilac: '#9CA4FF',
  salmon: '#FFAE9B',
  sky: '#00EEFF',
  red: '#FF6854',
  yellow: '#FFEA00',
  green: '#A6FF59',
  orange: '#FFAA0D',
}

export const COLOR_RAMP_DEFAULT_NUM_STEPS = 10
export const COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE = [7, 3]

export const HEATMAP_COLOR_RAMPS: Record<ColorRampsIds, string[]> = {
  teal: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.teal),
  teal_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.teal),
  magenta: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.magenta),
  magenta_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.magenta),
  lilac: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.lilac),
  lilac_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.lilac),
  salmon: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.salmon),
  salmon_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.salmon),
  sky: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.sky),
  sky_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.sky),
  red: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.red),
  red_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.red),
  yellow: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.yellow),
  yellow_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.yellow),
  green: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.green),
  green_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.green),
  orange: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.orange),
  orange_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.orange),
}
