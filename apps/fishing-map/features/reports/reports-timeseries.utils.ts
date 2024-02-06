import {
  getRealValues,
  getTimeSeries,
  TimeSeriesFrame,
} from '@globalfishingwatch/fourwings-aggregate'
import {
  Interval,
  pickActiveTimeChunk,
  quantizeOffsetToDate,
} from '@globalfishingwatch/layer-composer'
import { ReportGraphMode, ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { FilteredPolygons } from 'features/reports/reports-geo.utils'
import { DateTimeSeries } from 'features/reports/reports.hooks'
import { DataviewFeature } from 'features/map/map-sources.hooks'
import { getUTCDateTime } from 'utils/dates'
import { ComparisonGraphData } from 'features/reports/activity/ReportActivityPeriodComparisonGraph'

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
  sourceInterval: Interval,
  compareDeltaMillis?: number
): DateTimeSeries => {
  const dateFrameseries = frameTimeseries.map((frameValues) => {
    const { frame, ...rest } = frameValues
    const date = quantizeOffsetToDate(frame, sourceInterval)
    const compareDate = compareDeltaMillis
      ? new Date(date.getTime() + compareDeltaMillis).toISOString()
      : undefined
    return {
      values: Object.values(rest) as number[],
      date: date.toISOString(),
      compareDate,
    }
  })
  return dateFrameseries
}

export const featuresToTimeseries = (
  filteredFeatures: FilteredPolygons[],
  {
    layersWithFeatures,
    showTimeComparison,
    compareDeltaMillis,
    graphMode = 'evolution',
  }: {
    layersWithFeatures: DataviewFeature[]
    showTimeComparison: boolean
    compareDeltaMillis: number
    graphMode?: ReportGraphMode
  }
): ReportGraphProps[] => {
  return filteredFeatures.map((filteredFeature, sourceIndex) => {
    const featureToTimeseries = {
      interval: '' as Interval,
      graphMode,
      sublayers: [],
      timeseries: [],
    } as ReportGraphProps
    const sourceMetadata = layersWithFeatures[sourceIndex]?.metadata
    if (!sourceMetadata || sourceMetadata?.static === true) {
      return featureToTimeseries
    }
    // TODO handle multiple timechunks
    const sourceActiveTimeChunk = pickActiveTimeChunk(sourceMetadata.timeChunks)
    if (!sourceActiveTimeChunk) {
      return featureToTimeseries
    }
    const sourceNumSublayers = showTimeComparison ? 2 : sourceMetadata.numSublayers
    const sourceQuantizeOffset = sourceActiveTimeChunk.quantizeOffset
    const sourceInterval = sourceMetadata.timeChunks.interval
    const { values: valuesContainedRaw } = getTimeSeries({
      features: (filteredFeature.contained as any) || ([] as any),
      numSublayers: sourceNumSublayers,
      quantizeOffset: sourceQuantizeOffset,
      aggregationOperation: sourceMetadata.aggregationOperation,
    })

    const valuesContained = frameTimeseriesToDateTimeseries(
      valuesContainedRaw,
      sourceInterval,
      compareDeltaMillis
    )

    const featuresContainedAndOverlapping = [
      ...(filteredFeature.contained || []),
      ...(filteredFeature.overlapping || []),
    ]
    const { values: valuesContainedAndOverlappingRaw } = getTimeSeries({
      features: featuresContainedAndOverlapping as any,
      numSublayers: sourceNumSublayers,
      quantizeOffset: sourceQuantizeOffset,
      aggregationOperation: sourceMetadata.aggregationOperation,
    })

    const valuesContainedAndOverlapping = frameTimeseriesToDateTimeseries(
      valuesContainedAndOverlappingRaw,
      sourceInterval,
      compareDeltaMillis
    )

    featureToTimeseries.interval = sourceInterval
    featureToTimeseries.sublayers = sourceMetadata.sublayers as any
    featureToTimeseries.timeseries = valuesContainedAndOverlapping.map(
      ({ values, date, compareDate }) => {
        const minValues = valuesContained.find((overlap) => overlap.date === date)?.values
        return {
          date,
          compareDate,
          // TODO take into account multiplier when calling getRealValue
          min: minValues ? getRealValues(minValues) : new Array(values.length).fill(0),
          max: getRealValues(values),
        } as ComparisonGraphData
      }
    )
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
