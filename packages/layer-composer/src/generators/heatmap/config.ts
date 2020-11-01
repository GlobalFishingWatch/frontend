import { ColorRampsIds, HeatmapAnimatedMode } from '../types'
import { DEFAULT_BACKGROUND_COLOR } from '..'
import { HeatmapAnimatedCombinationMode } from './types'

export const API_ENDPOINTS = {
  tiles: '4wings/tile/heatmap/{z}/{x}/{y}',
  statistics: '4wings/statistics',
}

export const HEATMAP_DEFAULT_MAX_ZOOM = 12

export const HEATMAP_MODE_COMBINATION: Record<
  HeatmapAnimatedMode,
  HeatmapAnimatedCombinationMode
> = {
  [HeatmapAnimatedMode.Compare]: HeatmapAnimatedCombinationMode.Compare,
  [HeatmapAnimatedMode.Bivariate]: HeatmapAnimatedCombinationMode.Bivariate,
  [HeatmapAnimatedMode.Blob]: HeatmapAnimatedCombinationMode.Literal,
  [HeatmapAnimatedMode.Extruded]: HeatmapAnimatedCombinationMode.Cumulative,
}

export const HEATMAP_MODE_LAYER_TYPE: Record<HeatmapAnimatedMode, string> = {
  [HeatmapAnimatedMode.Compare]: 'fill',
  [HeatmapAnimatedMode.Bivariate]: 'fill',
  [HeatmapAnimatedMode.Blob]: 'heatmap',
  [HeatmapAnimatedMode.Extruded]: 'fill-extrusion',
}

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

const DEFAULT_BACKGROUND_TRANSPARENT_COLOR = `rgba(${DEFAULT_BACKGROUND_COLOR.replace(')', ', 0)')}`

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
    '#274874', '#267C8A', '#26B39F', '#26FFBD',
    '#66518F', '#3E579A', '#667C9E', '#66FFC2',
    '#A659A9', '#A67CB2', '#A6B3BB', '#A6FFC7',
    '#FF64CE', '#FF7CCE', '#FFB3CE', '#FFFFFF',
  ],
}
