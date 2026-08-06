import { normal, screen } from 'color-blend'
import type { RGBA } from 'color-blend/dist/types'

import type { AnyColorRampId, ColorRampId, MultiHueColorRampId } from '#config/colorRamps.config'
import {
  BLEND_BACKGROUND,
  COLOR_RAMP_BIVARIATE_NUM_STEPS,
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE,
  DEFAULT_COLOR_RAMP_ID,
  HEATMAP_COLORS_BY_ID,
  MULTI_HUE_COLOR_RAMPS,
} from '#config/colorRamps.config'

import {
  hexToRgb,
  hexToRgbString,
  rgbaStringToComponents,
  rgbaStringToObject,
  rgbaToString,
  rgbToRgbString,
} from './colors'

export const isMultiHueColorRampId = (rampId?: string): rampId is MultiHueColorRampId =>
  !!rampId && rampId in MULTI_HUE_COLOR_RAMPS

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

const resolveColorRampId = (id?: ColorRampId): ColorRampId =>
  id && id in HEATMAP_COLORS_BY_ID ? id : DEFAULT_COLOR_RAMP_ID

export const getBivariateRamp = (colorRampsIds: ColorRampId[]) => {
  const [id1, id2] = colorRampsIds
  return [resolveColorRampId(id1), resolveColorRampId(id2)].map((id) =>
    getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID[id], COLOR_RAMP_BIVARIATE_NUM_STEPS).map(
      (rgba) => rgbaStringToObject(rgba)
    )
  )
}

export const getBlend = (color1: RGBA, color2: RGBA) => {
  return normal({ ...hexToRgb(BLEND_BACKGROUND), a: 1 }, screen(color1 as RGBA, color2 as RGBA))
}

export const getBivariateRampLegend = (colorRampsIds: ColorRampId[]) => {
  if (!colorRampsIds || colorRampsIds.length < 2 || colorRampsIds.some((id) => !id)) {
    return []
  }
  const [ramp1, ramp2] = getBivariateRamp(colorRampsIds)
  if (!ramp1?.length || !ramp2?.length) {
    return []
  }
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
  rampId: AnyColorRampId
  whiteEnd?: boolean
  format?: T
}): GetColorRampReturn<T> {
  const ramp = isMultiHueColorRampId(rampId)
    ? MULTI_HUE_COLOR_RAMPS[rampId].map((color) => `rgba(${hexToRgbString(color)}, 1)`)
    : whiteEnd
      ? getMixedOpacityToWhiteColorRamp(HEATMAP_COLORS_BY_ID[rampId] || rampId)
      : getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID[rampId] || rampId)
  if (rampId === 'bathymetry') ramp.reverse()
  if (format === 'rgba') return ramp as GetColorRampReturn<T>
  if (format === 'array')
    return ramp.map((rgba) => rgbaStringToComponents(rgba)) as GetColorRampReturn<T>
  return ramp.map((rgba) => rgbaStringToObject(rgba)) as GetColorRampReturn<T>
}
