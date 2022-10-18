import { DateTime } from 'luxon'
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
import { AnalysisGraphProps, AnalysisSublayerGraph } from 'features/analysis/AnalysisEvolutionGraph'
import { FilteredPolygons } from 'features/analysis/analysis-geo.utils'
import { DateTimeSeries } from 'features/analysis/analysis.hooks'
import { DataviewFeature } from 'features/map/map-sources.hooks'
import { getUTCDateTime } from 'utils/dates'

export const removeTimeseriesPadding = (timeseries?: AnalysisGraphProps[]) => {
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
  timeseries: AnalysisGraphProps[],
  start: string,
  end: string
) => {
  const startDate = getUTCDateTime(start)
  const endDate = getUTCDateTime(end)
  return timeseries?.map((layerTimeseries) => {
    return {
      ...layerTimeseries,
      timeseries: layerTimeseries?.timeseries.filter((current: any) => {
        const currentDate = getUTCDateTime(current.dat)
        return currentDate >= startDate && currentDate < endDate
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
  }: {
    layersWithFeatures: DataviewFeature[]
    showTimeComparison: boolean
    compareDeltaMillis: number
  }
) => {
  return filteredFeatures.flatMap((filteredFeatures, sourceIndex) => {
    const sourceMetadata = layersWithFeatures[sourceIndex]?.metadata
    if (!sourceMetadata) {
      return []
    }
    const sourceNumSublayers = showTimeComparison ? 2 : sourceMetadata.numSublayers
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

    const valuesContained = frameTimeseriesToDateTimeseries(
      valuesContainedRaw,
      sourceInterval,
      compareDeltaMillis
    )

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
      sourceInterval,
      compareDeltaMillis
    )

    const timeseries = valuesContainedAndOverlapping.map(({ values, date, compareDate }) => {
      const minValues = valuesContained.find((overlap) => overlap.date === date)?.values
      return {
        date,
        compareDate,
        // TODO take into account multiplier when calling getRealValue
        min: minValues ? getRealValues(minValues) : new Array(values.length).fill(0),
        max: getRealValues(values),
      }
    })

    return {
      timeseries,
      interval: sourceInterval,
      sublayers: sourceMetadata.sublayers as unknown as AnalysisSublayerGraph[],
    }
  })
}
