import type { ColorRampsIds } from '../types'

import { getColorRampByOpacitySteps, getMixedOpacityToWhiteColorRamp } from './util/colors'

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
  bathymetry: '#4069a6',
}

export const TIME_COMPARE_COLOR_RAMP = [
  '#3EF0FF', // -100 000
  '#3DADDF', // -50000 -> -100000
  '#4286C1', // -8000 -> -50000
  '#3F69A4', // 0 -> -8000
  '#4A4174',
  '#844A7F',
  '#B0547F',
  '#FF677D',
]

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
  bathymetry: getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID.bathymetry).reverse(),
  bathymetry_toWhite: getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID.bathymetry).reverse(),
}
