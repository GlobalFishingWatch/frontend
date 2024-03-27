import {
  getRealValues,
  getTimeSeries,
  TimeSeries,
  TimeSeriesFrame,
} from '@globalfishingwatch/fourwings-aggregate'
import {
  Interval,
  pickActiveTimeChunk,
  quantizeOffsetToDate,
} from '@globalfishingwatch/layer-composer'
import {
  FourwingsAggregationOperation,
  FourwingsDeckSublayer,
} from '@globalfishingwatch/deck-layers'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { ReportGraphMode, ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { FilteredPolygons } from 'features/reports/reports-geo.utils'
import { DateTimeSeries } from 'features/reports/reports.hooks'
import { DataviewFeature } from 'features/map/map-sources.hooks'
import { getUTCDateTime } from 'utils/dates'
import { ComparisonGraphData } from 'features/reports/activity/ReportActivityPeriodComparisonGraph'
import { getGraphDataFromFourwingsFeatures } from 'features/timebar/timebar.utils'

export const removeTimeseriesPadding = (timeseries?: ReportGraphProps[]) => {
  return timeseries?.map((timeserie) => {
    return {
      ...timeserie,
      timeseries: timeserie.timeseries?.filter(
        (time) => time.min[0] !== 0 || time.min[1] !== 0 || time.max[0] !== 0 || time.max[1] !== 0
      ),
    }
  })
}

export const filterTimeseriesByTimerange = (
  timeseries: ReportGraphProps[],
  start: string,
  end: string
) => {
  const startDate = getUTCDateTime(start)
  const endDate = getUTCDateTime(end)
  return timeseries?.map((layerTimeseries) => {
    return {
      ...layerTimeseries,
      timeseries: layerTimeseries?.timeseries.filter((current) => {
        const currentDate = getUTCDateTime(current.date)
        return (
          (current.max.some((v) => v !== 0) || current.min.some((v) => v !== 0)) &&
          currentDate >= startDate &&
          currentDate < endDate
        )
      }),
    }
  })
}

const frameTimeseriesToDateTimeseries = (
  frameTimeseries: TimeSeriesFrame[],
  compareDeltaMillis?: number
): DateTimeSeries => {
  const dateFrameseries = frameTimeseries.map((frameValues) => {
    const { frame, date, ...rest } = frameValues
    const dateTime = getUTCDate(date)
    const compareDate = compareDeltaMillis
      ? new Date(dateTime.getTime() + compareDeltaMillis).toISOString()
      : undefined
    return {
      values: Object.values(rest) as number[],
      date: dateTime.toISOString(),
      compareDate,
    }
  })
  return dateFrameseries
}

export type FeaturesToTimeseriesParams = {
  start: number
  end: number
  interval: FourwingsInterval
  staticHeatmap?: boolean
  aggregationOperation?: FourwingsAggregationOperation
  minVisibleValue?: number
  maxVisibleValue?: number
  sublayers: FourwingsDeckSublayer[]
  showTimeComparison?: boolean
  compareDeltaMillis?: number
  graphMode?: ReportGraphMode
}

export const featuresToTimeseries = (
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
    showTimeComparison,
    compareDeltaMillis,
    graphMode = 'evolution',
  }: FeaturesToTimeseriesParams
): ReportGraphProps[] => {
  return filteredFeatures.map(({ contained, overlapping }, sourceIndex) => {
    const featureToTimeseries: ReportGraphProps = {
      interval,
      mode: graphMode,
      sublayers: sublayers.map((sublayer) => ({
        id: sublayer.id,
        legend: {
          color: sublayer.color,
          unit: sublayer.unit,
        },
      })),
      timeseries: [],
    }
    // const sourceMetadata = layersWithFeatures[sourceIndex]?.metadata
    if (staticHeatmap === true) {
      return featureToTimeseries
    }

    const sourceNumSublayers = showTimeComparison ? 2 : sublayers.length
    // const sourceInterval = sourceMetadata.timeChunks.interval
    const valuesContainedRaw = getGraphDataFromFourwingsFeatures(
      contained as FourwingsFeature[],
      { sublayers: sourceNumSublayers, interval, start, end }
      // aggregationOperation: sourceMetadata.aggregationOperation,
      // minVisibleValue: sourceMetadata.minVisibleValue,
      // maxVisibleValue: sourceMetadata.maxVisibleValue,
    )

    // const { values: valuesContainedRaw } = getTimeSeries({
    //   features: (filteredFeature.contained as any) || ([] as any),
    //   numSublayers: sourceNumSublayers,
    //   quantizeOffset: sourceQuantizeOffset,
    //   aggregationOperation: sourceMetadata.aggregationOperation,
    //   minVisibleValue: sourceMetadata.minVisibleValue,
    //   maxVisibleValue: sourceMetadata.maxVisibleValue,
    // })

    // TODO:deck review if we can skip this step
    const valuesContained = frameTimeseriesToDateTimeseries(valuesContainedRaw, compareDeltaMillis)

    const featuresContainedAndOverlapping =
      overlapping.length > 0 ? [...(contained || []), ...(overlapping || [])] : []

    let valuesContainedAndOverlappingRaw: TimeSeries['values'] = []
    if (featuresContainedAndOverlapping.length > 0) {
      valuesContainedAndOverlappingRaw = getGraphDataFromFourwingsFeatures(
        featuresContainedAndOverlapping as FourwingsFeature[],
        { sublayers: sourceNumSublayers, interval, start, end }
        // aggregationOperation: sourceMetadata.aggregationOperation,
        // minVisibleValue: sourceMetadata.minVisibleValue,
        // maxVisibleValue: sourceMetadata.maxVisibleValue,
      )
    }

    const valuesContainedAndOverlapping = frameTimeseriesToDateTimeseries(
      valuesContainedAndOverlappingRaw,
      compareDeltaMillis
    )

    featureToTimeseries.timeseries = valuesContained.map(({ values, date, compareDate }) => {
      const maxValues = valuesContainedAndOverlapping.find(
        (overlap) => overlap.date === date
      )?.values
      // const minValues = values
      return {
        date,
        compareDate,
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

export const formatEvolutionData = (data: ReportGraphProps) => {
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
