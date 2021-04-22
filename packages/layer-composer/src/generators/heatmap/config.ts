import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import { ColorRampsIds, HeatmapAnimatedMode } from '../types'
import { DEFAULT_BACKGROUND_COLOR } from '..'

export const API_ENDPOINTS = {
  tiles: '4wings/tile/heatmap/{z}/{x}/{y}',
  breaks: '4wings/binds/{zoom}',
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
  return color
}

const rgbToRgbString = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return `${r}, ${g}, ${b}`
}

const hexToRgbString = (hex: string) => {
  const color = hex2Rgb(hex)
  return rgbToRgbString(color)
}

const getColorRampByOpacitySteps = (finalColor: string, numSteps = 8) => {
  const color = finalColor.includes('#') ? hexToRgbString(finalColor) : finalColor
  const opacitySteps = [...Array(numSteps)].map((_, i) => i / (numSteps - 1))
  return opacitySteps.map((opacity) => `rgba(${color}, ${opacity})`)
}

const getColorRampToWhite = (hexColor: string, numSteps = 3) => {
  const rgbColor = hex2Rgb(hexColor)
  const steps = [...Array(numSteps - 1)].map((_, i) => {
    const ratio = (i + 1) / numSteps
    const rgb = {
      r: rgbColor.r + (255 - rgbColor.r) * ratio,
      g: rgbColor.g + (255 - rgbColor.g) * ratio,
      b: rgbColor.b + (255 - rgbColor.b) * ratio,
    }
    return `rgb(${rgbToRgbString(rgb)})`
  })

  const ramp = [...steps, 'rgb(255, 255, 255)']

  return ramp
}

const getMixedOpacityToWhiteColorRamp = (
  finalColor: string,
  numStepsOpacity = 5,
  numStepsTopWhite = 3
) => {
  return [
    ...getColorRampByOpacitySteps(finalColor, numStepsOpacity),
    ...getColorRampToWhite(finalColor, numStepsTopWhite),
  ]
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
  teal_toWhite: getMixedOpacityToWhiteColorRamp('#00FFBC'),
  magenta: getColorRampByOpacitySteps('#FF64CE'),
  magenta_toWhite: getMixedOpacityToWhiteColorRamp('#FF64CE'),
  lilac: getColorRampByOpacitySteps('#9CA4FF'),
  lilac_toWhite: getMixedOpacityToWhiteColorRamp('#9CA4FF'),
  salmon: getColorRampByOpacitySteps('#FFAE9B'),
  salmon_toWhite: getMixedOpacityToWhiteColorRamp('#FFAE9B'),
  sky: getColorRampByOpacitySteps('#00EEFF'),
  sky_toWhite: getMixedOpacityToWhiteColorRamp('#00EEFF'),
  red: getColorRampByOpacitySteps('#FF6854'),
  red_toWhite: getMixedOpacityToWhiteColorRamp('#FF6854'),
  yellow: getColorRampByOpacitySteps('#FFEA00'),
  yellow_toWhite: getMixedOpacityToWhiteColorRamp('#FFEA00'),
  green: getColorRampByOpacitySteps('#A6FF59'), // 166,255,89
  green_toWhite: getMixedOpacityToWhiteColorRamp('#A6FF59'), // 166,255,89
  orange: getColorRampByOpacitySteps('#FFAA0D'),
  orange_toWhite: getMixedOpacityToWhiteColorRamp('#FFAA0D'),
  // prettier-ignore
  bivariate: [
    DEFAULT_BACKGROUND_TRANSPARENT_COLOR,
    '#113869', '#207D8C', '#17B4A0', '#26FFBD',
    '#66518F', '#667CA0', '#63B3AD', '#66FFC2',
    '#A659A9', '#A67CB2', '#A6B3BB', '#A6FFC7',
    '#FF64CE', '#FF7CCE', '#FFB3CE', '#FFFFFF',
  ],
}
