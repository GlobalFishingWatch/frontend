import { MapboxGeoJSONFeature } from "@globalfishingwatch/mapbox-gl"
import { MiniglobeBounds } from "@globalfishingwatch/ui-components/dist/miniglobe"
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { Interval, quantizeOffsetToDate } from '@globalfishingwatch/layer-composer'
import { filterByViewport } from 'features/map/map.utils'

export const getTimeseries = (
  allChunksFeatures: { features: MapboxGeoJSONFeature[],
  quantizeOffset: number }[],
  bounds: MiniglobeBounds,
  numSublayers: number,
  interval: Interval,
  visibleSublayers: boolean[]
) => {
  let prevMaxFrame: number
  const allChunksValues = allChunksFeatures.flatMap((chunk: { features: MapboxGeoJSONFeature[], quantizeOffset: number }) => {
    const chunkQuantizeOffset = chunk.quantizeOffset
    const filteredFeatures = filterByViewport(chunk.features, bounds)
    if (filteredFeatures?.length > 0) {
      const { values, maxFrame } = getTimeSeries(
        filteredFeatures as any,
        numSublayers,
        chunkQuantizeOffset
      )

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
    } else return []
  })
  return allChunksValues
}
