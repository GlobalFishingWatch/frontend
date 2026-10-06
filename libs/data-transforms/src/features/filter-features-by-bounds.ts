// import { sample } from 'simple-statistics'

import type {
  FourwingsFeature,
  FourwingsFeatureProperties,
  FourwingsPointFeature,
} from '@globalfishingwatch/deck-loaders'
import { getFourwingsSublayerStartFrame } from '@globalfishingwatch/deck-loaders'

export interface Bounds {
  north: number
  south: number
  west: number
  east: number
}

// const MAX_FEATURES_TO_CHECK = 5000

// Copied from below to avoid importing the dependency
// import type { GeoJSONFeature } from 'maplibre-gl'
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

export const isFeatureInBounds = (
  f: GeoJSONFeature | FourwingsFeature | FourwingsPointFeature,
  { north, east, south, west }: Bounds
) => {
  const lon =
    (f as FourwingsPointFeature).geometry?.coordinates[0] ||
    (f as FourwingsFeature)?.coordinates?.[0] ||
    (f as GeoJSONFeature).properties?.lon
  const lat =
    (f as FourwingsPointFeature).geometry?.coordinates[1] ||
    (f as FourwingsFeature)?.coordinates?.[1] ||
    (f as GeoJSONFeature).properties?.lat
  if (lat < south || lat > north) {
    return false
  }
  const rightWorldCopy = east >= 180
  const leftWorldCopy = west <= -180
  // This tries to translate features longitude for a proper comparison against the viewport
  // when they fall in a left or right copy of the world but not in the center one
  // but... https://c.tenor.com/YwSmqv2CZr8AAAAd/dog-mechanic.gif
  const featureInLeftCopy = lon > 0 && lon - 360 >= west
  const featureInRightCopy = lon < 0 && lon + 360 <= east
  const leftOffset = leftWorldCopy && !rightWorldCopy && featureInLeftCopy ? -360 : 0
  const rightOffset = rightWorldCopy && !leftWorldCopy && featureInRightCopy ? 360 : 0
  return lon + leftOffset + rightOffset > west && lon + leftOffset + rightOffset < east
}

export const filterFeaturesByBounds = ({
  features,
  bounds,
  onlyValuesAndStartFrame = false,
}: {
  features: GeoJSONFeature[] | FourwingsFeature[] | FourwingsPointFeature[]
  bounds: Bounds
  onlyValuesAndStartFrame?: boolean
}) => {
  if (!bounds || !features?.length) {
    return []
  }

  return features.flatMap((f) => {
    if (!f) {
      return []
    }
    const isInBounds = isFeatureInBounds(f, bounds)
    if (onlyValuesAndStartFrame) {
      return isInBounds
        ? [
            f.properties.values?.map((sublayerValues: number[], sublayerIndex: number) => {
              return [
                sublayerValues,
                // values[i] happened at getIntervalTimestamp(startFrame + i)
                getFourwingsSublayerStartFrame(
                  f.properties as FourwingsFeatureProperties,
                  sublayerIndex
                ),
              ]
            }),
          ]
        : []
    }
    return isInBounds ? f : []
  })
}
