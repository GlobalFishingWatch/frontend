import type { LayerMetadataLegend} from '../../../types';
import { LegendType } from '../../../types'
import type { ColorRampId, ColorRampsIds} from '../../types';
import { HeatmapAnimatedMode } from '../../types'
import { HEATMAP_COLOR_RAMPS, HEATMAP_COLORS_BY_ID, TIME_COMPARE_COLOR_RAMP } from '../colors'
import { GRID_AREA_BY_ZOOM_LEVEL,HEATMAP_DEFAULT_MAX_ZOOM } from '../config'
import type { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'

import { getBlend, getColorRampByOpacitySteps, rgbaStringToObject, rgbaToString } from './colors'
import type { Breaks, FetchBreaksParams} from './fetch-breaks';
import { isDirectAPIBreaks } from './fetch-breaks'
import { getCleanBreaks } from './get-breaks'
import { toDT } from './time-chunks'

// Get color ramps for a config's sublayers
export const getSublayersColorRamps = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  const visibleSublayers = config.sublayers?.filter((s) => s.visible)

  // Force bivariate color ramp depending on config
  if (config.mode === HeatmapAnimatedMode.Bivariate) {
    const ramp = getBivariateRamp(visibleSublayers.map((s) => s.colorRamp as ColorRampId))
    return config.sublayers?.map(() => ramp)
  } else if (config.mode === HeatmapAnimatedMode.TimeCompare) {
    return [TIME_COMPARE_COLOR_RAMP]
  }

  return config.sublayers?.map(({ colorRamp, colorRampWhiteEnd = true, visible }) => {
    const useToWhiteRamp =
      config.totalHeatmapAnimatedGenerators === 1 &&
      visibleSublayers?.length === 1 &&
      visible &&
      colorRampWhiteEnd
    const finalColorRamp = useToWhiteRamp ? (`${colorRamp}_toWhite` as ColorRampsIds) : colorRamp
    return HEATMAP_COLOR_RAMPS[finalColorRamp] || HEATMAP_COLOR_RAMPS[colorRamp]
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

export const getSublayersBreaks = (config: FetchBreaksParams, breaks: Breaks | undefined) => {
  // const delta = +toDT(config.end) - +toDT(config.start)
  const start = toDT(config.start)
  const end = toDT(config.end)
  // uses 'years' as breaks request a year with temporal-aggregation true
  const directApiBreaks = isDirectAPIBreaks(config)
  let deltaInterval = end.diff(start, 'days').days / 30
  const baseMultiplier = config.mode === HeatmapAnimatedMode.TimeCompare ? 1 / 10 : 1 / 4
  if (directApiBreaks && (config.interval === 'DAY' || config.interval === 'HOUR')) {
    deltaInterval =
      config.interval === 'DAY' ? end.diff(start, 'day').days : end.diff(start, 'hour').hours
  }
  const sublayersBreaks = breaks?.map((bre) => {
    return getCleanBreaks(
      bre.map((b) => deltaInterval * b * Math.pow(baseMultiplier, config.zoomLoadLevel))
    )
  })

  if (config.mode === HeatmapAnimatedMode.TimeCompare && sublayersBreaks) {
    let biggerBreaks
    let currentBiggerBreakMaxValue = 0
    for (let index = 0; index < sublayersBreaks.length; index++) {
      const sublayerBreaks = sublayersBreaks[index]
      // Assuming the last value is the bigger one
      const sublayerLastBreak = sublayerBreaks[sublayerBreaks.length - 1]
      if (sublayerLastBreak > currentBiggerBreakMaxValue) {
        currentBiggerBreakMaxValue = sublayerLastBreak
        biggerBreaks = sublayerBreaks
      }
    }
    if (!biggerBreaks) return undefined
    const negativeBreaks = biggerBreaks.slice(1).map((bre) => -bre)
    negativeBreaks.reverse()
    return [negativeBreaks.concat(biggerBreaks)]
  }

  return sublayersBreaks
}

const getGridAreaByZoom = (zoom: number): number => {
  const gridZoom = Math.floor(Math.min(zoom, HEATMAP_DEFAULT_MAX_ZOOM))
  const gridArea = GRID_AREA_BY_ZOOM_LEVEL[gridZoom]
  return gridArea
}

export const getLegendsCompare = (config: GlobalHeatmapAnimatedGeneratorConfig, breaks: Breaks) => {
  const ramps = getSublayersColorRamps(config)

  if (!breaks?.length) {
    return config.sublayers?.flatMap((subLayer, sublayerIndex) => {
      const sublayerColorRamp = ramps[sublayerIndex]
      const sublayerLegend: LayerMetadataLegend = {
        id: subLayer.id,
        unit: subLayer.legend?.unit,
        type: LegendType.ColorRampDiscrete,
        loading: true,
        ramp: [],
        colorRamp: sublayerColorRamp,
      }

      return sublayerLegend
    })
  }

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
        let value: string | null = null
        if (i === 0) value = 'less'
        else if (i === legendRamp.length - 1) value = 'more'
        return [value, legendItem[1]]
      })
    }

    const sublayerLegend: LayerMetadataLegend = {
      id: config.sublayers?.[sublayerIndex].id,
      unit:
        config.sublayers?.[sublayerIndex].legend?.unit ||
        config.sublayers?.[sublayerIndex].metadata?.legend?.unit,
      type: LegendType.ColorRampDiscrete,
      loading: false,
      ramp: legendRamp,
      colorRamp: sublayerColorRamp,
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
    rgbaToString(getBlend({ ...white, a: 0.25 }, getBlend(ramp1[2], ramp2[2]))),
    rgbaToString(getBlend({ ...white, a: 0.5 }, getBlend(ramp1[3], ramp2[2]))),
    rgbaToString(getBlend(ramp1[0], ramp2[3])),
    rgbaToString(getBlend(ramp1[1], ramp2[3])),
    rgbaToString(getBlend({ ...white, a: 0.5 }, getBlend(ramp1[2], ramp2[3]))),
    rgbaToString(getBlend(white, getBlend(ramp1[3], ramp2[3]))),
  ]
}

const getLegendsBivariate = (config: GlobalHeatmapAnimatedGeneratorConfig, breaks: Breaks) => {
  const visibleSublayers = config.sublayers?.filter((s) => s.visible)
  const ids = visibleSublayers.map((s) => s.id)
  const colorRampsIds = visibleSublayers.map((subLayer) => subLayer.colorRamp as ColorRampId)
  const subLayer = visibleSublayers?.[0]

  if (!subLayer) {
    console.warn('No visible sublayers for bivariate config', config)
    return []
  }

  return [
    {
      id: subLayer.id,
      ids,
      type: LegendType.Bivariate,
      bivariateRamp: getBivariateRamp(colorRampsIds),
      unit: subLayer.legend?.unit,
      loading: !breaks?.length,
      sublayersBreaks: breaks,
    },
  ]
}

const getLegendsTimeCompare = (config: GlobalHeatmapAnimatedGeneratorConfig, breaks: Breaks) => {
  const sublayer = config.sublayers[0]
  const colorRamp = getSublayersColorRamps(config)[0]
  let ramp: [number | null | string, string][] = []
  if (breaks.length && colorRamp) {
    const sublayerBreaks = breaks[0] as [number, number, number, number, number, number, number]
    ramp = colorRamp.map((color, i) => {
      if (i === 0) return [-Infinity, color]
      return [sublayerBreaks[i - 1], color]
    })
  }
  return [
    {
      mode: config.mode,
      id: sublayer.id,
      type: LegendType.ColorRampDiscrete,
      unit: sublayer.legend?.unit,
      loading: !breaks?.length,
      sublayersBreaks: breaks,
      ramp,
      colorRamp: TIME_COMPARE_COLOR_RAMP,
      divergent: true,
    },
  ]
}

const getLegends = (config: GlobalHeatmapAnimatedGeneratorConfig, breaks: Breaks) => {
  let legends: LayerMetadataLegend[] = []
  if (config.mode === HeatmapAnimatedMode.TimeCompare) {
    legends = getLegendsTimeCompare(config, breaks)
  } else if (config.mode === HeatmapAnimatedMode.Bivariate) {
    legends = getLegendsBivariate(config, breaks)
  } else {
    legends = getLegendsCompare(config, breaks)
  }
  if (!legends) {
    return []
  }

  const gridArea = getGridAreaByZoom(config.zoom)

  return legends.map((legend: LayerMetadataLegend) => ({
    ...legend,
    ...(gridArea && { gridArea }),
  }))
}

export default getLegends
