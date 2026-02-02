import type { DateTimeUnit, DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'
import { max, mean, min } from 'simple-statistics'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { formatDateForInterval, getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
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

import { DATASET_COMPARISON_SUFFIX, PRIMARY_BLUE_COLOR } from 'data/config'
import i18n from 'features/i18n/i18n'
import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type {
  EvolutionGraphData,
  ReportGraphProps,
} from 'features/reports/reports-timeseries.hooks'
import type { ReportFourwingsDeckLayer } from 'features/reports/reports-timeseries.utils'
import type { TimeSeries } from 'features/reports/reports-timeseries-shared.utils'
import { frameTimeseriesToDateTimeseries } from 'features/reports/reports-timeseries-shared.utils'
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
      sublayers: (sublayers || [])?.map((sublayer) => ({
        id: sublayer?.id,
        legend: {
          color: sublayer?.color || PRIMARY_BLUE_COLOR,
          unit: sublayer?.unit,
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
      } as EvolutionGraphData
    })
    return featureToTimeseries
  })
}

export type GetFourwingsTimeseriesParams = {
  features: FilteredPolygons[]
  instance: ReportFourwingsDeckLayer
}
export const getFourwingsTimeseries = ({ features, instance }: GetFourwingsTimeseriesParams) => {
  if ((instance as FourwingsLayer).props.static || !features || !instance.getChunk) {
    // need to add empty timeseries because they are then used by their index
    return {
      timeseries: [],
      interval: 'MONTH',
      sublayers: [],
    } as ReportGraphProps
  }
  const chunk = instance.getChunk?.()
  if (!chunk) return
  const sublayers = (instance as FourwingsLayer).getFourwingsLayers()
  const props = instance.props as FourwingsLayerProps
  const params: FourwingsFeaturesToTimeseriesParams = {
    staticHeatmap: props.static,
    interval: chunk.interval,
    start: props.comparisonMode === 'timeCompare' ? props.startTime : chunk.bufferedStart,
    end: props.comparisonMode === 'timeCompare' ? props.endTime : chunk.bufferedEnd,
    compareStart: props.compareStart,
    compareEnd: props.compareEnd,
    aggregationOperation: instance.getAggregationOperation(),
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
    if ((instance as FourwingsLayer).props.static) {
      const allValues = (features[0].contained as FourwingsStaticFeature[]).flatMap((f) => {
        return f.properties?.[HEATMAP_STATIC_PROPERTY_ID] || []
      })
      if (allValues.length > 0) {
        return {
          type: 'fourwings' as const,
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
        values: f.properties.values?.[0] || [0],
        startFrame,
        endFrame,
        startOffset: f.properties.startOffsets?.[0] || 0,
      })
      return values || []
    })
    if (allValues.length > 0) {
      return {
        type: 'fourwings' as const,
        min: min(allValues),
        max: max(allValues),
        mean: mean(allValues),
      }
    }
  }
  return
}

export const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

export const formatEvolutionData = (
  data: ReportGraphProps,
  { start, end, timeseriesInterval, removeEmptyValues } = {} as {
    start: string
    end: string
    timeseriesInterval: FourwingsInterval
    removeEmptyValues?: boolean
  },
  comparedData?: ReportGraphProps
) => {
  if (!data?.timeseries) {
    return []
  }
  if (start && end && timeseriesInterval) {
    const isMonthlyComparison =
      comparedData && comparedData.interval === 'MONTH' && data.interval !== comparedData.interval
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

    let lastKnownComparedValue: EvolutionGraphData | undefined = isMonthlyComparison
      ? comparedData?.timeseries[0]
      : undefined

    return Array(intervalDiff)
      .fill(0)
      .map((_, i) => {
        const date = getUTCDateTime(startMillis).plus({ [timeseriesInterval]: i })
        let dataValue = data.timeseries.find((item) => date.toISO()?.startsWith(item.date))
        if (!dataValue && data.interval === 'MONTH' && timeseriesInterval === 'DAY') {
          dataValue = data.timeseries.find((item) =>
            date.startOf('month').toISO()?.startsWith(item.date)
          )
        }
        if (!dataValue && removeEmptyValues) {
          return {
            date: date.toMillis(),
            range: [null],
            avg: [null],
          }
        }

        const processTimeseries = (value: typeof dataValue) =>
          value
            ? {
                range: value.min.map((m, i) => [m, value.max[i]]),
                avg: value.min.map((m, i) => (m + value.max[i]) / 2),
              }
            : { range: emptyData, avg: emptyData }

        const dataProcessed = processTimeseries(dataValue)
        let range
        let avg

        if (comparedData) {
          let comparedDataValue = comparedData?.timeseries.find((item) =>
            date.toISO()?.startsWith(item.date)
          )
          if (isMonthlyComparison) {
            if (comparedDataValue) {
              lastKnownComparedValue = comparedDataValue
            } else {
              comparedDataValue = lastKnownComparedValue
            }
          }

          const comparedProcessed = processTimeseries(comparedDataValue)
          range = [...dataProcessed.range, ...comparedProcessed.range].flat()
          avg = [...dataProcessed.avg, ...comparedProcessed.avg].flat()
        } else {
          range = dataProcessed.range
          avg = dataProcessed.avg
        }

        return {
          date: date.toMillis(),
          range,
          avg,
        }
      })
      .filter((d) => {
        if (removeEmptyValues) {
          return true
        }
        return !isNaN(d.avg?.[0] || 0)
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

export function cleanDatasetComparisonDataviewInstances(
  dataviewInstances: (UrlDataviewInstance | DataviewInstance)[] = []
) {
  return dataviewInstances?.filter(
    (dataviewInstance) => !dataviewInstance.id.includes(DATASET_COMPARISON_SUFFIX)
  )
}
