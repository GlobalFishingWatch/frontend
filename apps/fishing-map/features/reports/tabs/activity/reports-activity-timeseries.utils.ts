import type { DateTimeUnit, DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'
import { max, mean, min } from 'simple-statistics'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type {
  FourwingsAggregationOperation,
  FourwingsDeckSublayer,
  FourwingsLayer,
  FourwingsLayerProps,
} from '@globalfishingwatch/deck-layers'
import {
  getIntervalFrames,
  HEATMAP_STATIC_PROPERTY_ID,
  sliceCellValues,
} from '@globalfishingwatch/deck-layers'
import type {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsStaticFeature,
} from '@globalfishingwatch/deck-loaders'

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import type { TimeSeries } from 'features/reports/reports-timeseries-shared.utils'
import { frameTimeseriesToDateTimeseries } from 'features/reports/reports-timeseries-shared.utils'
import type { ComparisonGraphData } from 'features/reports/tabs/activity/ReportActivityPeriodComparisonGraph'
import type { TimeRange } from 'features/timebar/timebar.slice'
import { getGraphDataFromFourwingsHeatmap } from 'features/timebar/timebar.utils'

export type FourwingsFeaturesToTimeseriesParams = {
  start: number
  end: number
  compareStart?: number
  compareEnd?: number
  interval: FourwingsInterval
  staticHeatmap?: boolean
  aggregationOperation?: FourwingsAggregationOperation
  minVisibleValue?: number
  maxVisibleValue?: number
  sublayers: FourwingsDeckSublayer[]
}
export const fourwingsFeaturesToTimeseries = (
  filteredFeatures: FilteredPolygons[],
  {
    start,
    end,
    staticHeatmap,
    interval,
    aggregationOperation,
    minVisibleValue,
    maxVisibleValue,
    sublayers,
    compareStart,
    compareEnd,
  }: FourwingsFeaturesToTimeseriesParams
): ReportGraphProps[] => {
  return filteredFeatures.map(({ contained, overlapping }) => {
    const featureToTimeseries: ReportGraphProps = {
      interval,
      sublayers: sublayers.map((sublayer) => ({
        id: sublayer.id,
        legend: {
          color: sublayer.color,
          unit: sublayer.unit,
        },
      })),
      timeseries: [],
    }
    if (staticHeatmap === true) {
      return featureToTimeseries
    }

    const valuesContainedRaw = getGraphDataFromFourwingsHeatmap(contained as FourwingsFeature[], {
      sublayers,
      interval,
      start,
      end,
      compareStart,
      compareEnd,
      aggregationOperation,
      minVisibleValue,
      maxVisibleValue,
    })

    const valuesContained = frameTimeseriesToDateTimeseries(valuesContainedRaw as any)

    const featuresContainedAndOverlapping =
      overlapping.length > 0 ? [...(contained || []), ...(overlapping || [])] : []

    let valuesContainedAndOverlappingRaw: TimeSeries['values'] = []
    if (featuresContainedAndOverlapping.length > 0) {
      valuesContainedAndOverlappingRaw = getGraphDataFromFourwingsHeatmap(
        featuresContainedAndOverlapping as FourwingsFeature[],
        {
          sublayers,
          interval,
          start,
          end,
          compareStart,
          compareEnd,
          aggregationOperation,
          minVisibleValue,
          maxVisibleValue,
        }
      ) as any
    }

    const valuesContainedAndOverlapping = frameTimeseriesToDateTimeseries(
      valuesContainedAndOverlappingRaw
    )

    featureToTimeseries.timeseries = valuesContained.map(({ values, date }) => {
      const maxValues = valuesContainedAndOverlapping.find(
        (overlap) => overlap.date === date
      )?.values
      // const minValues = values
      return {
        date,
        // TODO take into account multiplier when calling getRealValue
        min: values,
        max: maxValues
          ? maxValues
          : valuesContainedAndOverlapping.length > 0
            ? new Array(values.length).fill(0)
            : values,
      } as ComparisonGraphData
    })
    return featureToTimeseries
  })
}

export type GetFourwingsTimeseriesParams = {
  features: FilteredPolygons[]
  instance: FourwingsLayer
}
export const getFourwingsTimeseries = ({ features, instance }: GetFourwingsTimeseriesParams) => {
  if (instance.props.static || !features || !instance.getChunk) {
    // need to add empty timeseries because they are then used by their index
    return {
      timeseries: [],
      interval: 'MONTH',
      sublayers: [],
    } as ReportGraphProps
  }
  const chunk = instance.getChunk?.()
  if (!chunk) return
  const sublayers = instance.getFourwingsLayers()
  const props = instance.props as FourwingsLayerProps
  const params: FourwingsFeaturesToTimeseriesParams = {
    staticHeatmap: props.static,
    interval: chunk.interval,
    start: props.comparisonMode === 'timeCompare' ? props.startTime : chunk.bufferedStart,
    end: props.comparisonMode === 'timeCompare' ? props.endTime : chunk.bufferedEnd,
    compareStart: props.compareStart,
    compareEnd: props.compareEnd,
    aggregationOperation: props.aggregationOperation,
    minVisibleValue: props.minVisibleValue,
    maxVisibleValue: props.maxVisibleValue,
    sublayers,
  }
  return fourwingsFeaturesToTimeseries(features, params)[0]
}
export const getFourwingsTimeseriesStats = ({
  features,
  instance,
  start,
  end,
}: GetFourwingsTimeseriesParams & TimeRange) => {
  if (features?.[0]?.contained?.length > 0) {
    if (instance.props.static) {
      const allValues = (features[0].contained as FourwingsStaticFeature[]).flatMap((f) => {
        return f.properties?.[HEATMAP_STATIC_PROPERTY_ID] || []
      })
      if (allValues.length > 0) {
        return {
          min: min(allValues),
          max: max(allValues),
          mean: mean(allValues),
        }
      }
      return
    }
    const chunk = instance.getChunk?.()
    if (!chunk) return
    const { startFrame, endFrame } = getIntervalFrames({
      startTime: DateTime.fromISO(start).toUTC().toMillis(),
      endTime: DateTime.fromISO(end).toUTC().toMillis(),
      availableIntervals: [chunk.interval],
      bufferedStart: chunk.bufferedStart,
    })
    const allValues = (features[0].contained as FourwingsFeature[]).flatMap((f) => {
      const values = sliceCellValues({
        values: f.properties.values[0],
        startFrame,
        endFrame,
        startOffset: f.properties.startOffsets[0],
      })
      return values || []
    })
    if (allValues.length > 0) {
      return {
        min: min(allValues),
        max: max(allValues),
        mean: mean(allValues),
      }
    }
  }
  return
}

export const formatEvolutionData = (
  data: ReportGraphProps,
  { start, end, timeseriesInterval } = {} as {
    start: string
    end: string
    timeseriesInterval: FourwingsInterval
  }
) => {
  if (!data?.timeseries) {
    return []
  }
  if (start && end && timeseriesInterval) {
    const emptyData = new Array(data.sublayers.length).fill(0)
    const startMillis = getUTCDateTime(start)
      .startOf(timeseriesInterval.toLowerCase() as DateTimeUnit)
      .toMillis()
    const endMillis = getUTCDateTime(end)
      .startOf(timeseriesInterval.toLowerCase() as DateTimeUnit)
      .toMillis()

    const intervalDiff = Math.floor(
      Duration.fromMillis(endMillis - startMillis).as(
        timeseriesInterval.toLowerCase() as DurationUnit
      )
    )

    return Array(intervalDiff)
      .fill(0)
      .map((_, i) => {
        const date = getUTCDateTime(startMillis).plus({ [timeseriesInterval]: i })
        const dataValue = data.timeseries.find((item) => date.toISO()?.startsWith(item.date))
        if (!dataValue) {
          return {
            date: date.toMillis(),
            range: emptyData,
            avg: emptyData,
          }
        }
        const range = dataValue.min.map((m, i) => [m, dataValue.max[i]])
        const avg = dataValue.min.map((m, i) => (m + dataValue.max[i] || 0) / 2)

        return {
          date: date.toMillis(),
          range,
          avg,
        }
      })
      .filter((d) => {
        return !isNaN(d.avg[0])
      })
  }

  return data?.timeseries
    ?.map(({ date, min, max }) => {
      const range = min.map((m, i) => [m, max[i]])
      const avg = min.map((m, i) => (m + max[i]) / 2)
      return {
        date: new Date(date).getTime(),
        range,
        avg,
      }
    })
    .filter((d) => {
      return !isNaN(d.avg[0])
    })
}
