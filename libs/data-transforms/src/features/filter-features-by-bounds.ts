import { sample } from 'simple-statistics'

import type {
  FourwingsFeature,
  FourwingsFeatureProperties,
  FourwingsStaticFeature,
} from '@globalfishingwatch/deck-loaders'

export interface Bounds {
  north: number
  south: number
  west: number
  east: number
}

const MAX_FEATURES_TO_CHECK = 5000

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

export const filterFeaturesByBounds = ({
  features,
  bounds,
  onlyValuesAndDates = false,
  sampleData = false,
}: {
  features: GeoJSONFeature[] | FourwingsFeature[] | FourwingsStaticFeature[]
  bounds: Bounds
  onlyValuesAndDates?: boolean
  sampleData?: boolean
}) => {
  if (!bounds) {
    return []
  }
  const { north, east, south, west } = bounds
  const rightWorldCopy = east >= 180
  const leftWorldCopy = west <= -180

  const featuresToCheck = sampleData
    ? sample(features as any[], Math.min(features.length, MAX_FEATURES_TO_CHECK), Math.random)
    : features

  return featuresToCheck.flatMap((f) => {
    const lon = (f as any)?.coordinates?.[0] || (f as GeoJSONFeature).properties?.lon
    const lat = (f as any)?.coordinates?.[1] || (f as GeoJSONFeature).properties?.lat
    if (lat < south || lat > north) {
      return []
    }
    // This tries to translate features longitude for a proper comparison against the viewport
    // when they fall in a left or right copy of the world but not in the center one
    // but... https://c.tenor.com/YwSmqv2CZr8AAAAd/dog-mechanic.gif
    const featureInLeftCopy = lon > 0 && lon - 360 >= west
    const featureInRightCopy = lon < 0 && lon + 360 <= east
    const leftOffset = leftWorldCopy && !rightWorldCopy && featureInLeftCopy ? -360 : 0
    const rightOffset = rightWorldCopy && !leftWorldCopy && featureInRightCopy ? 360 : 0
    const isInBounds =
      lon + leftOffset + rightOffset > west && lon + leftOffset + rightOffset < east
    if (onlyValuesAndDates) {
      return isInBounds
        ? [
            f.properties.values.map((sublayerValues: number[], sublayerIndex: number) => {
              return [
                sublayerValues,
                (f.properties as FourwingsFeatureProperties).dates?.[sublayerIndex],
              ]
            }),
          ]
        : []
    }
    return isInBounds ? f : []
  })
}
