import { TimeSeries, TimeSeriesFrame } from '@globalfishingwatch/fourwings-aggregate'
import {
  FourwingsAggregationOperation,
  FourwingsDeckSublayer,
} from '@globalfishingwatch/deck-layers'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import {
  ReportGraphMode,
  ReportGraphProps,
} from 'features/reports/activity/reports-activity-timeseries.hooks'
import { FilteredPolygons } from 'features/reports/activity/reports-activity-geo.utils'
import { DateTimeSeries } from 'features/reports/areas/reports.hooks'
import { getUTCDateTime } from 'utils/dates'
import { ComparisonGraphData } from 'features/reports/activity/ReportActivityPeriodComparisonGraph'
import { getGraphDataFromFourwingsHeatmap } from 'features/timebar/timebar.utils'

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

const frameTimeseriesToDateTimeseries = (frameTimeseries: TimeSeriesFrame[]): DateTimeSeries => {
  const dateFrameseries = frameTimeseries.map((frameValues) => {
    const { frame, count, date, ...rest } = frameValues
    const dateTime = getUTCDate(date)
    return {
      values: Object.values(rest) as number[],
      date: dateTime.toISOString(),
    }
  })
  return dateFrameseries
}

export type FeaturesToTimeseriesParams = {
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
    compareStart,
    compareEnd,
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

    // const sourceInterval = sourceMetadata.timeChunks.interval
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
