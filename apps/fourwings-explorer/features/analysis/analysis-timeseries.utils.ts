import { DateTime } from 'luxon'
import type {
  TimeSeriesFrame} from '@globalfishingwatch/fourwings-aggregate';
import {
  getRealValues,
  getTimeSeries
} from '@globalfishingwatch/fourwings-aggregate'
import type {
  HeatmapLayerMeta,
  Interval} from '@globalfishingwatch/layer-composer';
import {
  pickActiveTimeChunk,
  quantizeOffsetToDate,
} from '@globalfishingwatch/layer-composer'
import type { LayerFeature } from '@globalfishingwatch/features-aggregate'
import type { AnalysisGraphProps } from 'features/analysis/AnalysisEvolutionGraph'
import type { DateTimeSeries } from 'features/analysis/analysis.hooks'
import type { FilteredPolygons } from 'features/analysis/analysis-geo.utils'

export const filterTimeseriesByTimerange = (
  timeseries: AnalysisGraphProps[],
  start: string,
  end: string
) => {
  const startDate = DateTime.fromISO(start)
  const endDate = DateTime.fromISO(end)
  return timeseries?.map((layerTimeseries) => {
    return {
      ...layerTimeseries,
      timeseries: layerTimeseries?.timeseries.filter((current: any) => {
        const currentDate = DateTime.fromISO(current.date)
        return currentDate >= startDate && currentDate < endDate
      }),
    }
  })
}

const frameTimeseriesToDateTimeseries = (
  frameTimeseries: TimeSeriesFrame[],
  sourceInterval: Interval
): DateTimeSeries => {
  const dateFrameseries = frameTimeseries.map((frameValues) => {
    const { frame, ...rest } = frameValues
    const date = quantizeOffsetToDate(frame, sourceInterval)
    return {
      values: Object.values(rest) as number[],
      date: date.toISOString(),
    }
  })
  return dateFrameseries
}

export const featuresToTimeseries = (
  filteredFeatures: FilteredPolygons[],
  {
    layersWithFeatures,
  }: {
    layersWithFeatures: LayerFeature[]
  }
) => {
  return filteredFeatures.flatMap((filteredFeatures, sourceIndex) => {
    const sourceMetadata: HeatmapLayerMeta = layersWithFeatures[sourceIndex]?.metadata
    if (!sourceMetadata) {
      return []
    }
    const sourceNumSublayers = sourceMetadata.numSublayers
    // TODO handle multiple timechunks
    const sourceActiveTimeChunk = pickActiveTimeChunk(sourceMetadata.timeChunks)
    const sourceQuantizeOffset = sourceActiveTimeChunk.quantizeOffset
    const sourceInterval = sourceMetadata.timeChunks.interval
    const { values: valuesContainedRaw } = getTimeSeries({
      features: filteredFeatures.contained || ([] as any),
      numSublayers: sourceNumSublayers,
      quantizeOffset: sourceQuantizeOffset,
      aggregationOperation: sourceMetadata.aggregationOperation,
    })

    const valuesContained = frameTimeseriesToDateTimeseries(valuesContainedRaw, sourceInterval)

    const featuresContainedAndOverlapping = [
      ...(filteredFeatures.contained || []),
      ...(filteredFeatures.overlapping || []),
    ]
    const { values: valuesContainedAndOverlappingRaw } = getTimeSeries({
      features: featuresContainedAndOverlapping as any,
      numSublayers: sourceNumSublayers,
      quantizeOffset: sourceQuantizeOffset,
      aggregationOperation: sourceMetadata.aggregationOperation,
    })

    const valuesContainedAndOverlapping = frameTimeseriesToDateTimeseries(
      valuesContainedAndOverlappingRaw,
      sourceInterval
    )

    const timeseries = valuesContainedAndOverlapping.map(({ values, date }) => {
      const minValues = valuesContained.find((overlap) => overlap.date === date)?.values
      return {
        date,
        // TODO take into account multiplier when calling getRealValue
        min: minValues ? getRealValues(minValues) : new Array(values.length).fill(0),
        max: getRealValues(values),
      }
    })

    const layer = sourceMetadata.sublayers?.[0]
    return {
      timeseries,
      interval: sourceInterval,
      layer: {
        id: layer.id,
        legend: layer.legend,
      },
    }
  })
}
