import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import { ColorRampsIds, HeatmapAnimatedMode } from '../types'
import { DEFAULT_BACKGROUND_COLOR } from '..'

export const API_ENDPOINTS = {
  tiles: '4wings/tile/heatmap/{z}/{x}/{y}',
  statistics: '4wings/statistics',
}

export const HEATMAP_DEFAULT_MAX_ZOOM = 12

export const HEATMAP_MODE_COMBINATION: Record<HeatmapAnimatedMode, SublayerCombinationMode> = {
  [HeatmapAnimatedMode.Single]: SublayerCombinationMode.None,
  [HeatmapAnimatedMode.Compare]: SublayerCombinationMode.Max,
  [HeatmapAnimatedMode.Bivariate]: SublayerCombinationMode.Bivariate,
  [HeatmapAnimatedMode.Blob]: SublayerCombinationMode.Literal,
  [HeatmapAnimatedMode.Extruded]: SublayerCombinationMode.Cumulative,
}

export const HEATMAP_MODE_LAYER_TYPE: Record<HeatmapAnimatedMode, string> = {
  [HeatmapAnimatedMode.Single]: 'fill',
  [HeatmapAnimatedMode.Compare]: 'fill',
  [HeatmapAnimatedMode.Bivariate]: 'fill',
  [HeatmapAnimatedMode.Blob]: 'heatmap',
  [HeatmapAnimatedMode.Extruded]: 'fill-extrusion',
}

export const GRID_AREA_BY_ZOOM_LEVEL = [
  128000000000,
  32000000000,
  8000000000,
  2000000000,
  500000000,
  120000000,
  31000000,
  8000000,
  2000000,
  500000,
  125000,
  30000,
  7500,
]

const hex2Rgb = (hex: string) => {
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return `${color.r}, ${color.g}, ${color.b}`
}

const getColorRampByOpacitySteps = (finalColor: string, numSteps = 8) => {
  const color = finalColor.includes('#') ? hex2Rgb(finalColor) : finalColor
  const opacitySteps = [...Array(numSteps)].map((_, i) => i / (numSteps - 1))
  return opacitySteps.map((opacity) => `rgba(${color}, ${opacity})`)
}

const DEFAULT_BACKGROUND_TRANSPARENT_COLOR = DEFAULT_BACKGROUND_COLOR.replace(
  'rgb(',
  'rgba('
).replace(')', ', 0)')

export const HEATMAP_COLOR_RAMPS: Record<ColorRampsIds, string[]> = {
  fishing: [DEFAULT_BACKGROUND_TRANSPARENT_COLOR, '#3B9088', '#EEFF00', '#ffffff'],
  presence: [
    DEFAULT_BACKGROUND_TRANSPARENT_COLOR,
    '#163F89',
    '#0F6F97',
    '#07BBAE',
    '#00FFC3',
    '#FFFFFF',
  ],
  reception: ['rgb(255, 69, 115, 1)', '#7b2e8d', '#093b76', DEFAULT_BACKGROUND_TRANSPARENT_COLOR],
  teal: getColorRampByOpacitySteps('#00FFBC'),
  // teal: [
  //   DEFAULT_BACKGROUND_TRANSPARENT_COLOR,
  //   '#FF64CE',
  //   '#9CA4FF',
  //   '#FFAE9B',
  //   '#00EEFF',
  //   '#FF6854',
  //   '#FFEA00',
  //   '#A6FF59',
  // ],
  magenta: getColorRampByOpacitySteps('#FF64CE'),
  lilac: getColorRampByOpacitySteps('#9CA4FF'),
  salmon: getColorRampByOpacitySteps('#FFAE9B'),
  sky: getColorRampByOpacitySteps('#00EEFF'),
  red: getColorRampByOpacitySteps('#FF6854'),
  yellow: getColorRampByOpacitySteps('#FFEA00'),
  green: getColorRampByOpacitySteps('#A6FF59'), // 166,255,89
  orange: getColorRampByOpacitySteps('#FFAA0D'),
  // prettier-ignore
  bivariate: [
    DEFAULT_BACKGROUND_TRANSPARENT_COLOR,
    '#113869', '#207D8C', '#17B4A0', '#26FFBD',
    '#66518F', '#667CA0', '#63B3AD', '#66FFC2',
    '#A659A9', '#A67CB2', '#A6B3BB', '#A6FFC7',
    '#FF64CE', '#FF7CCE', '#FFB3CE', '#FFFFFF',
  ],
  // bivariate: [
  //   DEFAULT_BACKGROUND_TRANSPARENT_COLOR,
  //   '#000', '#267C8A', '#26B39F', 'red',
  //   '#66518F', '#FFEA00', '#667C9E', '#66FFC2',
  //   '#A659A9', '#A67CB2', '#FFAA0D', '#A6FFC7',
  //   'blue', '#FF7CCE', '#FFB3CE', '#FFFFFF',
  // ],
}
