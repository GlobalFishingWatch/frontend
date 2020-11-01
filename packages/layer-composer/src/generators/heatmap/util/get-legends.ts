import { LayerMetadataLegend } from '../../../types'
import { HeatmapAnimatedMode, ColorRampsIds } from '../../types'
import { HEATMAP_COLOR_RAMPS } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import getBreaks from './get-breaks'

// Get color ramps for a config's sublayers
export const getSublayersColorRamps = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  // TODO Use ramp from first sublayer
  const colorRampIds =
    config.mode === HeatmapAnimatedMode.Bivariate
      ? ['bivariate' as ColorRampsIds]
      : config.sublayers.map((s) => s.colorRamp)
  const colorRamps = colorRampIds.map((colorRampId) => {
    const originalColorRamp = HEATMAP_COLOR_RAMPS[colorRampId]
    return originalColorRamp
  })
  return colorRamps
}

// Gets MGL layer paint configuration from base color ramp(s)
export const getColorRampBaseExpression = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
  const colorRamps = getSublayersColorRamps(config)

  const expressions = colorRamps.map((originalColorRamp, colorRampIndex) => {
    const legend = [...Array(originalColorRamp.length)].map((_, bucketIndex) => [
      // offset each dataset by 10 + add actual bucket value
      colorRampIndex * 10 + bucketIndex,
      originalColorRamp[bucketIndex],
    ])
    // TODO use flatMap
    const expr = legend.flat()
    return expr
  })

  if (config.mode === HeatmapAnimatedMode.Compare) {
    return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions.flat() }
  }

  return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions[0] }
}

const STATS_MAX = 100
const STATS_AVG = 30
const SCALEPOWEXPONENT = 1
const STATS_MAX_BIVARIATE = 15
const STATS_AVG_BIVARIATE = 3
const SCALEPOWEXPONENT_BIVARIATE = 1.5

// Gets breaks depending on config (alternative method to stats API)
export const getSublayersBreaks = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  intervalInDays: number
) => {
  // TODO - generate this using updated stats API ?
  // TODO - For each sublayer a different set of breaks should be produced
  const ramps = getSublayersColorRamps(config)
  return config.sublayers.map((_, sublayerIndex) => {
    const sublayerColorRamp = ramps[sublayerIndex]
    const numBreaks = config.mode === HeatmapAnimatedMode.Bivariate ? 4 : sublayerColorRamp.length
    const max = config.mode === HeatmapAnimatedMode.Bivariate ? STATS_MAX_BIVARIATE : STATS_MAX
    const avg = config.mode === HeatmapAnimatedMode.Bivariate ? STATS_AVG_BIVARIATE : STATS_AVG
    const scalePowExponent =
      config.mode === HeatmapAnimatedMode.Bivariate ? SCALEPOWEXPONENT_BIVARIATE : SCALEPOWEXPONENT
    return getBreaks(1, max, avg, scalePowExponent, numBreaks, intervalInDays)
  })
}

const getLegendsCompare = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  intervalInDays: number
) => {
  const sublayersBreaks = getSublayersBreaks(config, intervalInDays)
  const ramps = getSublayersColorRamps(config)
  return sublayersBreaks.map((sublayerBreaks, sublayerIndex) => {
    const sublayerColorRamp = ramps[sublayerIndex]
    let legendRamp = sublayerColorRamp.flatMap((rampColor, rampColorIndex) => {
      const isLastColor = rampColorIndex === sublayerColorRamp.length - 1
      const isFirstColor = rampColorIndex === 0

      const startColor = rampColor
      const endColor = isLastColor ? startColor : sublayerColorRamp[rampColorIndex + 1]

      const startBucket = isFirstColor
        ? Number.NEGATIVE_INFINITY
        : sublayerBreaks[rampColorIndex - 1]
      const endBucket = isLastColor ? Number.POSITIVE_INFINITY : sublayerBreaks[rampColorIndex]
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
      type: 'colorramp-discrete',
      ramp: legendRamp,
    }
    return sublayerLegend
  })
}

const getLegendsBivariate = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  intervalInDays: number
) => {
  const sublayersBreaks = getSublayersBreaks(config, intervalInDays)
  const ramp = HEATMAP_COLOR_RAMPS.bivariate
  return [
    {
      id: config.sublayers[0].id,
      type: 'bivariate',
      bivariateRamp: ramp,
      sublayersBreaks,
    },
  ] as any
}

const getLegends = (config: GlobalHeatmapAnimatedGeneratorConfig, intervalInDays: number) => {
  return config.mode === HeatmapAnimatedMode.Bivariate
    ? getLegendsBivariate(config, intervalInDays)
    : getLegendsCompare(config, intervalInDays)
}

export default getLegends
