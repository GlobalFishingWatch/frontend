import { aggregateCell } from '@globalfishingwatch/fourwings-aggregate'
import {
  ExtendedStyle,
  pickActiveTimeChunk,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
  TimeChunks,
} from '@globalfishingwatch/layer-composer'
import type { Map } from '@globalfishingwatch/maplibre-gl'
import { mglToMiniGlobeBounds } from 'features/map/map-viewport.hooks'
import { filterByViewport } from 'features/map/map.utils'

export const getDataviewViewportFeatures = (map: Map, dataviewId: string) => {
  if (!map) {
    return
  }
  const style = map.getStyle && (map.getStyle() as ExtendedStyle)
  const generatorsMetadata = style?.metadata?.generatorsMetadata
  if (!generatorsMetadata) return null

  const metadata = generatorsMetadata[dataviewId]
  if (!metadata) {
    return
  }
  const timeChunks = metadata.timeChunks as TimeChunks
  const frame = timeChunks?.activeChunkFrame
  const bounds = mglToMiniGlobeBounds(map.getBounds())
  const activeTimeChunk = pickActiveTimeChunk(timeChunks)
  const allFeaturesValues = timeChunks.chunks.map((chunk) => {
    const features = map.querySourceFeatures(chunk.sourceId as string, {
      sourceLayer: TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
    })
    const filteredFeatures = filterByViewport(features, bounds)
    const featuresValues = filteredFeatures.flatMap(({ properties }) => {
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
