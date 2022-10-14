import { DateTime } from 'luxon'
import { uniqBy } from 'lodash'
import { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import {
  AggregationOperation,
  getTimeSeries,
  TimeSeriesFrame,
  getRealValue,
  TimeseriesFeatureProps,
} from '@globalfishingwatch/fourwings-aggregate'
import {
  HeatmapLayerMeta,
  Interval,
  quantizeOffsetToDate,
} from '@globalfishingwatch/layer-composer'

export type TilesSourceState = {
  loaded: boolean
  error?: string
}

export type ChunkFeature = {
  active: boolean
  state: TilesSourceState
  features: GeoJSONFeature<TimeseriesFeatureProps>[]
  quantizeOffset: number
}

export type LayerFeature = {
  state: TilesSourceState
  sourceId: string
  features: GeoJSONFeature[]
  chunksFeatures: ChunkFeature[]
  metadata?: HeatmapLayerMeta
}

type TimeseriesParams = {
  chunksFeatures: ChunkFeature[]
  numSublayers: number
  interval: Interval
  visibleSublayers: boolean[]
  aggregationOperation: AggregationOperation
  multiplier?: number
  minVisibleValue?: number
  maxVisibleValue?: number
}

export const getChunksTimeseries = ({
  chunksFeatures,
  numSublayers,
  interval,
  visibleSublayers,
  aggregationOperation,
  multiplier,
  minVisibleValue,
  maxVisibleValue,
}: TimeseriesParams) => {
  const allChunksValues = chunksFeatures?.flatMap(({ features, quantizeOffset }) => {
    if (features?.length > 0) {
      const { values } = getTimeSeries({
        features,
        numSublayers,
        quantizeOffset,
        aggregationOperation,
        minVisibleValue,
        maxVisibleValue,
      })
      const finalValues = values.map((frameValues) => {
        // Ideally we don't have the features not visible in 4wings but we have them
        // so this needs to be filtered by the current active ones
        const activeFrameValues = Object.fromEntries(
          Object.entries(frameValues).map(([key, value]) => {
            const cleanValue =
              key === 'frame' || visibleSublayers[parseInt(key)] === true ? value : 0
            const realValue = getRealValue(cleanValue, { multiplier })
            return [key, realValue]
          })
        ) as TimeSeriesFrame
        return {
          ...activeFrameValues,
          date: quantizeOffsetToDate(frameValues.frame, interval).getTime(),
        }
      })
      if (aggregationOperation === AggregationOperation.Avg) {
        const lastItem = finalValues[finalValues.length - 1]
        const month = DateTime.fromMillis(lastItem.date, { zone: 'utc' })
        const nextMonth = DateTime.fromMillis(lastItem.date, { zone: 'utc' }).plus({
          [interval]: 1,
        })
        const millisOffset = nextMonth.diff(month).milliseconds
        return finalValues.concat({
          ...lastItem,
          frame: lastItem.frame + 1,
          date: lastItem.date + millisOffset,
        })
      }
      return finalValues
    } else {
      return []
    }
  })
  return allChunksValues
}

export const getTimeseriesFromFeatures = (layerFeatures: LayerFeature[]) => {
  const uniqLayerFeatures = uniqBy(layerFeatures, 'sourceId')
  const dataviewsTimeseries = uniqLayerFeatures.map(({ chunksFeatures, metadata, state }) => {
    if (!state.loaded || state.error || !chunksFeatures || !metadata) {
      // TODO return loading or null depending on state
      return []
    }

    const timeChunks = metadata.timeChunks
    const timeseries = getChunksTimeseries({
      chunksFeatures,
      interval: timeChunks.interval,
      numSublayers: metadata.numSublayers,
      visibleSublayers: metadata.visibleSublayers,
      aggregationOperation: metadata.aggregationOperation,
      multiplier: metadata.multiplier,
      minVisibleValue: metadata.minVisibleValue,
      maxVisibleValue: metadata.maxVisibleValue,
    })
    return timeseries
  })
  return dataviewsTimeseries[0]
}
