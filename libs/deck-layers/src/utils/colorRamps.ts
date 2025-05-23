import { normal, screen } from 'color-blend'
import type { RGBA } from 'color-blend/dist/types'

import {
  hexToRgb,
  hexToRgbString,
  rgbaStringToComponents,
  rgbaStringToObject,
  rgbaToString,
  rgbToRgbString,
} from './colors'

export const COLOR_RAMP_DEFAULT_NUM_STEPS = 10
export const COLOR_RAMP_BIVARIATE_NUM_STEPS = 4
export const COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE = [7, 3]

// ---- Heatmap Generator color ramps types
export type ColorRampId =
  | 'teal'
  | 'magenta'
  | 'lilac'
  | 'salmon'
  | 'sky'
  | 'red'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'bathymetry' // Custom one for the bathymetry dataset

export type ColorRampWhiteId =
  | 'teal_toWhite'
  | 'magenta_toWhite'
  | 'lilac_toWhite'
  | 'salmon_toWhite'
  | 'sky_toWhite'
  | 'red_toWhite'
  | 'yellow_toWhite'
  | 'green_toWhite'
  | 'orange_toWhite'
  | 'bathymetry_toWhite'

export type ColorRampsIds = ColorRampId | ColorRampWhiteId

export const HEATMAP_COLORS_BY_ID: Record<ColorRampId, string> = {
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
  '#00D7E6',
  '#02AFCC',
  '#0392B9',
  '#0474A6',
  '#055994',
  '#5F2B64',
  '#84396A',
  '#B14972',
  '#D75879',
  '#FF6680',
]

const MIN_OPACITY = 0.1

export const getColorRampByOpacitySteps = (
  finalColor: string,
  numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS
) => {
  const color = finalColor?.includes('#') ? hexToRgbString(finalColor) : finalColor
  const opacityStep = (1 - MIN_OPACITY) / numSteps
  const opacitySteps = [...Array(numSteps)].map((_, i) => MIN_OPACITY + (i + 1) * opacityStep)
  return opacitySteps.map((opacity) => `rgba(${color}, ${opacity})`)
}

export const getColorRampToWhite = (
  hexColor: string,
  numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE[1]
) => {
  const rgbColor = hexToRgb(hexColor)
  const steps = [...Array(numSteps - 1)].map((_, i) => {
    const ratio = (i + 1) / numSteps
    const rgb = {
      r: Math.floor(rgbColor.r + (255 - rgbColor.r) * ratio),
      g: Math.floor(rgbColor.g + (255 - rgbColor.g) * ratio),
      b: Math.floor(rgbColor.b + (255 - rgbColor.b) * ratio),
    }
    return `rgb(${rgbToRgbString(rgb)})`
  })

  const ramp = [...steps, 'rgb(255, 255, 255)']

  return ramp
}

export const getMixedOpacityToWhiteColorRamp = (
  finalColor: string,
  numStepsOpacity = COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE[0],
  numStepsTopWhite = COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE[1]
) => {
  return [
    ...getColorRampByOpacitySteps(finalColor, numStepsOpacity),
    ...getColorRampToWhite(finalColor, numStepsTopWhite),
  ]
}

export const getBivariateRamp = (colorRampsIds: ColorRampId[]) => {
  return colorRampsIds.map((id) =>
    getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID[id] || id, COLOR_RAMP_BIVARIATE_NUM_STEPS).map(
      (rgba) => rgbaStringToObject(rgba)
    )
  )
}

export const BLEND_BACKGROUND = '#0f2e5f'
export const getBlend = (color1: RGBA, color2: RGBA) => {
  return normal({ ...hexToRgb(BLEND_BACKGROUND), a: 1 }, screen(color1 as RGBA, color2 as RGBA))
}

export const getBivariateRampLegend = (colorRampsIds: ColorRampId[]) => {
  const [ramp1, ramp2] = getBivariateRamp(colorRampsIds)
  return [
    'transparent',
    rgbaToString({ ...getBlend(ramp1[0], ramp2[0]), a: 0.5 }),
    rgbaToString({ ...getBlend(ramp1[1], ramp2[0]), a: 0.75 }),
    rgbaToString(getBlend(ramp1[2], ramp2[0])),
    rgbaToString(getBlend(ramp1[3], ramp2[0])),
    rgbaToString({ ...getBlend(ramp1[0], ramp2[1]), a: 0.75 }),
    rgbaToString(getBlend(ramp1[1], ramp2[1])),
    rgbaToString(getBlend(ramp1[2], ramp2[1])),
    rgbaToString(getBlend(ramp1[3], ramp2[1])),
    rgbaToString(getBlend(ramp1[0], ramp2[2])),
    rgbaToString(getBlend(ramp1[1], ramp2[2])),
    rgbaToString(getBlend(ramp1[2], ramp2[2])),
    rgbaToString(getBlend(ramp1[3], ramp2[2])),
    rgbaToString(getBlend(ramp1[0], ramp2[3])),
    rgbaToString(getBlend(ramp1[1], ramp2[3])),
    rgbaToString(getBlend(ramp1[2], ramp2[3])),
    rgbaToString(getBlend(ramp1[3], ramp2[3])),
  ]
}

type GetColorRampReturn<T extends 'rgba' | 'object' | 'array'> = {
  rgba: string[]
  object: RGBA[]
  array: [number, number, number, number][]
}[T]

export function getColorRamp<T extends 'rgba' | 'object' | 'array' = 'object'>({
  rampId,
  whiteEnd = false,
  format = 'object' as T,
}: {
  rampId: ColorRampId
  whiteEnd?: boolean
  format?: T
}): GetColorRampReturn<T> {
  const ramp = whiteEnd
    ? getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID[rampId] || rampId)
    : getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID[rampId] || rampId)
  if (rampId === 'bathymetry') ramp.reverse()
  if (format === 'rgba') return ramp as GetColorRampReturn<T>
  if (format === 'array')
    return ramp.map((rgba) => rgbaStringToComponents(rgba)) as GetColorRampReturn<T>
  return ramp.map((rgba) => rgbaStringToObject(rgba)) as GetColorRampReturn<T>
}
