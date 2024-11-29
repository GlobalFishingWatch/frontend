import { aggregateCell } from '@globalfishingwatch/fourwings-aggregate'
import type {
  HeatmapLayerMeta,
  TimeChunks} from '@globalfishingwatch/layer-composer';
import {
  pickActiveTimeChunk
} from '@globalfishingwatch/layer-composer'

// Copied from below to avoid importing the dependency
// import type { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
export declare class GeoJSONFeature<P = Record<string, any>> {
  type: 'Feature'
  _geometry: GeoJSON.Geometry
  properties: P
  id: number | string | undefined
  _vectorTileFeature: any
  constructor(
    vectorTileFeature: any,
    z: number,
    x: number,
    y: number,
    id: string | number | undefined
  )
  get geometry(): GeoJSON.Geometry
  set geometry(g: GeoJSON.Geometry)
  toJSON(): any
}

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
