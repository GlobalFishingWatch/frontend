import { uniqBy } from 'lodash'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { quantizeOffsetToDate, Interval } from '@globalfishingwatch/layer-composer'
import { DataviewChunkFeature, DataviewFeature } from 'features/map/map-sources.hooks'

type TimeseriesParams = {
  chunksFeatures: DataviewChunkFeature[]
  numSublayers: number
  interval: Interval
  visibleSublayers: boolean[]
}

export const getChunksTimeseries = ({
  chunksFeatures,
  numSublayers,
  interval,
  visibleSublayers,
}: TimeseriesParams) => {
  let prevMaxFrame: number

  const allChunksValues = chunksFeatures.flatMap(({ features, quantizeOffset }) => {
    if (features?.length > 0) {
      const { values, maxFrame } = getTimeSeries(features, numSublayers, quantizeOffset)

      const valuesTimeChunkOverlapFramesFiltered = prevMaxFrame
        ? values.filter((frameValues) => frameValues.frame > prevMaxFrame)
        : values

      prevMaxFrame = maxFrame

      const finalValues = valuesTimeChunkOverlapFramesFiltered.map((frameValues) => {
        // Ideally we don't have the features not visible in 4wings but we have them
        // so this needs to be filtered by the current active ones
        const activeFrameValues = Object.fromEntries(
          Object.entries(frameValues).map(([key, value]) => {
            const cleanValue =
              key === 'frame' || visibleSublayers[parseInt(key)] === true ? value : 0
            return [key, cleanValue]
          })
        )
        return {
          ...activeFrameValues,
          date: quantizeOffsetToDate(frameValues.frame, interval).getTime(),
        }
      })
      return finalValues
    } else {
      return []
    }
  })
  return allChunksValues
}

export const getTimeseriesFromDataviews = (dataviewFeatures: DataviewFeature[]) => {
  const uniqDataviewFeatures = uniqBy(dataviewFeatures, 'sourceId')
  const dataviewsTimeseries = uniqDataviewFeatures.map(({ chunksFeatures, metadata, state }) => {
    if (!state.loaded || state.error || !chunksFeatures) {
      // TODO return loading or null depending on state
      return []
    }
    const timeChunks = metadata.timeChunks
    const timeseries = getChunksTimeseries({
      chunksFeatures,
      interval: timeChunks.interval,
      numSublayers: metadata.numSublayers,
      visibleSublayers: metadata.visibleSublayers,
    })
    return timeseries
  })
  return dataviewsTimeseries[0]
}
