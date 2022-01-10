import { Feature } from '@globalfishingwatch/maplibre-gl'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { quantizeOffsetToDate, Interval } from '@globalfishingwatch/layer-composer'
import { DataviewFeature } from 'features/map/map-sources.hooks'

type TimeseriesParams = {
  features: Feature[]
  quantizeOffset: number
  numSublayers: number
  interval: Interval
  visibleSublayers: boolean[]
}
export const getTimeseries = ({
  features,
  quantizeOffset,
  numSublayers,
  interval,
  visibleSublayers,
}: TimeseriesParams) => {
  if (!features || !features.length) {
    return []
  }

  // let prevMaxFrame: number
  const { values, maxFrame } = getTimeSeries(features as any, numSublayers, quantizeOffset)

  // TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
  // TODO!! ask Erik what does it do  TODOTODOTODOTO!!
  // TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO

  // const valuesTimeChunkOverlapFramesFiltered = prevMaxFrame
  //   ? values.filter((frameValues) => frameValues.frame > prevMaxFrame)
  //   : values

  // prevMaxFrame = maxFrame

  const finalValues = values.map((frameValues) => {
    // Ideally we don't have the features not visible in 4wings but we have them
    // so this needs to be filtered by the current active ones
    const activeFrameValues = Object.fromEntries(
      Object.entries(frameValues).map(([key, value]) => {
        const cleanValue = key === 'frame' || visibleSublayers[parseInt(key)] === true ? value : 0
        return [key, cleanValue]
      })
    )
    return {
      ...activeFrameValues,
      date: quantizeOffsetToDate(frameValues.frame, interval).getTime(),
    }
  })
  return finalValues
}

export const getTimeseriesFromDataviews = (dataviewFeatures: DataviewFeature[]) => {
  console.log('reruns activity stack')
  const dataviewsTimeseries = dataviewFeatures.map(({ features, metadata, loaded }) => {
    if (!loaded || !features) {
      // TODO return loading or null depending on state
      return []
    }

    const timeChunks = metadata.timeChunks
    const quantizeOffset = timeChunks.chunks?.[0].quantizeOffset
    const timeseries = getTimeseries({
      features,
      quantizeOffset,
      interval: timeChunks.interval,
      numSublayers: metadata.numSublayers,
      visibleSublayers: metadata.visibleSublayers,
    })
    return timeseries
  })
  return dataviewsTimeseries[0]
}
