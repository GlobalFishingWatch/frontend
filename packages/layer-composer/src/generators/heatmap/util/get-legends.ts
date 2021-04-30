import { LayerMetadataLegend, LegendType } from '../../../types'
import { ColorRampId, ColorRampsIds, HeatmapAnimatedMode } from '../../types'
import {
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_COLOR_RAMPS,
  GRID_AREA_BY_ZOOM_LEVEL,
  HEATMAP_COLORS_BY_ID,
} from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { getBlend, getColorRampByOpacitySteps, rgbaStringToObject, rgbaToHex } from './colors'
import { Breaks, getBreaksZoom } from './fetch-breaks'
import { getCleanBreaks } from './get-breaks'
import { toDT } from './time-chunks'

// Get color ramps for a config's sublayers
export const getSublayersColorRamps = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  // Force bivariate color ramp depending on config
  if (config.mode === HeatmapAnimatedMode.Bivariate) {
    const ramp = getBivariateRamp(config.sublayers.map((s) => s.colorRamp as ColorRampId))
    return config.sublayers.map(() => ramp)
  }

  const numActiveSublayers = config.sublayers.filter((s) => s.visible).length
  return config.sublayers.map(({ colorRamp, colorRampWhiteEnd, visible }) => {
    const useToWhiteRamp = (numActiveSublayers === 1 && visible && colorRampWhiteEnd) ?? false
    const finalColorRamp = useToWhiteRamp ? (`${colorRamp}_toWhite` as ColorRampsIds) : colorRamp
    return HEATMAP_COLOR_RAMPS[finalColorRamp]
  })
}

// Gets MGL layer paint configuration from base color ramp(s)
export const getColorRampBaseExpression = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  const colorRamps = getSublayersColorRamps(config)

  const expressions = colorRamps.map((originalColorRamp, colorRampIndex) => {
    const legend = [...Array(originalColorRamp.length)].flatMap((_, bucketIndex) => [
      // offset each dataset by 10 + add actual bucket value
      colorRampIndex * 10 + bucketIndex,
      originalColorRamp[bucketIndex],
    ])
    return legend
  })

  if (config.mode === HeatmapAnimatedMode.Compare) {
    return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions.flat() }
  }

  return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions[0] }
}

export const getSublayersBreaks = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  breaks: Breaks | undefined
) => {
  // const delta = +toDT(config.end) - +toDT(config.start)
  const start = toDT(config.start)
  const end = toDT(config.end)
  // uses 'years' as breaks request a year with temporal-aggregation true
  const deltaInterval = end.diff(start, 'days').days / 10
  const zoomBreaksBaseline = getBreaksZoom(config.zoomLoadLevel)
  return breaks?.map((bre) => {
    return getCleanBreaks(
      bre.map((b) => deltaInterval * b * Math.pow(1 / 4, config.zoomLoadLevel - zoomBreaksBaseline))
    )
  })
}

const getGridAreaByZoom = (zoom: number): number => {
  const gridZoom = Math.floor(Math.min(zoom, HEATMAP_DEFAULT_MAX_ZOOM))
  const gridArea = GRID_AREA_BY_ZOOM_LEVEL[gridZoom]
  return gridArea
}

const getLegendsCompare = (config: GlobalHeatmapAnimatedGeneratorConfig, breaks: Breaks) => {
  const ramps = getSublayersColorRamps(config)
  return breaks.flatMap((sublayerBreaks, sublayerIndex) => {
    const sublayerColorRamp = ramps[sublayerIndex]
    if (!sublayerColorRamp) return []
    let legendRamp = sublayerColorRamp.flatMap((rampColor, rampColorIndex) => {
      // const isLastColor = rampColorIndex === sublayerColorRamp.length - 1
      const isFirstColor = rampColorIndex === 0

      const startColor = rampColor
      // const endColor = isLastColor ? startColor : sublayerColorRamp[rampColorIndex + 1]

      const startBucket = isFirstColor
        ? Number.NEGATIVE_INFINITY
        : sublayerBreaks[rampColorIndex - 1]
      // const endBucket = isLastColor ? Number.POSITIVE_INFINITY : sublayerBreaks[rampColorIndex]
      const legendRampItem: [number | null | string, string] = [startBucket, startColor]
      return [legendRampItem]
    })

    if (config.mode === HeatmapAnimatedMode.Blob) {
      legendRamp = legendRamp.map((legendItem, i) => {
        let value = null
        if (i === 0) value = 'less'
        else if (i === legendRamp.length - 1) value = 'more'
        return [value, legendItem[1]]
      })
    }

    const sublayerLegend: LayerMetadataLegend = {
      id: config.sublayers[sublayerIndex].id,
      unit: config.sublayers[sublayerIndex].legend?.unit,
      type: LegendType.ColorRampDiscrete,
      ramp: legendRamp,
    }
    return [sublayerLegend]
  })
}

const white = { r: 255, g: 255, b: 255, a: 1 }

const getBivariateRamp = (colorRampsIds: ColorRampId[]) => {
  const ramp1 = getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID[colorRampsIds[0]], 4).map((rgba) =>
    rgbaStringToObject(rgba)
  )
  const ramp2 = getColorRampByOpacitySteps(HEATMAP_COLORS_BY_ID[colorRampsIds[1]], 4).map((rgba) =>
    rgbaStringToObject(rgba)
  )
  return [
    'transparent',
    rgbaToHex(getBlend(ramp1[0], ramp2[0])),
    rgbaToHex(getBlend(ramp1[1], ramp2[0])),
    rgbaToHex(getBlend(ramp1[2], ramp2[0])),
    rgbaToHex(getBlend(ramp1[3], ramp2[0])),
    rgbaToHex(getBlend(ramp1[0], ramp2[1])),
    rgbaToHex(getBlend(ramp1[1], ramp2[1])),
    rgbaToHex(getBlend(ramp1[2], ramp2[1])),
    rgbaToHex(getBlend(ramp1[3], ramp2[1])),
    rgbaToHex(getBlend(ramp1[0], ramp2[2])),
    rgbaToHex(getBlend(ramp1[1], ramp2[2])),
    rgbaToHex(getBlend({ ...white, a: 0.25 }, getBlend(ramp1[2], ramp2[2]))),
    rgbaToHex(getBlend({ ...white, a: 0.5 }, getBlend(ramp1[3], ramp2[2]))),
    rgbaToHex(getBlend(ramp1[0], ramp2[3])),
    rgbaToHex(getBlend(ramp1[1], ramp2[3])),
    rgbaToHex(getBlend({ ...white, a: 0.5 }, getBlend(ramp1[2], ramp2[3]))),
    rgbaToHex(getBlend(white, getBlend(ramp1[3], ramp2[3]))),
  ]
}

const getLegendsBivariate = (config: GlobalHeatmapAnimatedGeneratorConfig, breaks: Breaks) => {
  const colorRampsIds = config.sublayers.map((l) => l.colorRamp as ColorRampId)
  return [
    {
      id: config.sublayers[0].id,
      type: LegendType.Bivariate,
      bivariateRamp: getBivariateRamp(colorRampsIds),
      sublayersBreaks: breaks,
    },
  ]
}

const getLegends = (config: GlobalHeatmapAnimatedGeneratorConfig, breaks: Breaks) => {
  const legends =
    config.mode === HeatmapAnimatedMode.Bivariate
      ? getLegendsBivariate(config, breaks)
      : getLegendsCompare(config, breaks)

  const gridArea = getGridAreaByZoom(config.zoom)

  return legends.map((legend: LayerMetadataLegend) => ({
    ...legend,
    ...(gridArea && { gridArea }),
  }))
}

export default getLegends
