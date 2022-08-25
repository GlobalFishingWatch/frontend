import { aggregateCell } from '@globalfishingwatch/fourwings-aggregate'
import {
  HeatmapLayerMeta,
  pickActiveTimeChunk,
  TimeChunks,
} from '@globalfishingwatch/layer-composer'
import type { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'

export const aggregateFeatures = (features: GeoJSONFeature[], metadata: HeatmapLayerMeta) => {
  const timeChunks = metadata.timeChunks as TimeChunks
  const frame = timeChunks?.activeChunkFrame
  const activeTimeChunk = pickActiveTimeChunk(timeChunks)
  const allFeaturesValues = timeChunks.chunks.map((chunk) => {
    const featuresValues = features.flatMap(({ properties }: any) => {
      const values = aggregateCell({
        rawValues: properties.rawValues,
        frame,
        delta: Math.max(1, timeChunks.deltaInIntervalUnits),
        quantizeOffset: activeTimeChunk.quantizeOffset,
        sublayerCount: metadata?.numSublayers,
        aggregationOperation: metadata?.aggregationOperation,
        sublayerCombinationMode: metadata?.sublayerCombinationMode,
        multiplier: metadata?.multiplier,
      })
      return (values || []).flatMap((value) =>
        isNaN(value) || value === 0 || value === null ? [] : value
      )
    })

    return featuresValues
  })

  return allFeaturesValues.flatMap((f) => f).sort((a, b) => a - b)
}
