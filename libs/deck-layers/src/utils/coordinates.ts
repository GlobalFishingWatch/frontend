import type { Viewport } from '@deck.gl/core'
import type { GeoBoundingBox } from '@deck.gl/geo-layers'
import { lerp } from '@math.gl/core'
import type { Feature } from 'geojson'

const availableTransformations: Record<any, any> = {
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
}

function Point([pointX, pointY]: [number, number], [nw, se]: number[][], viewport: Viewport) {
  const x = lerp(nw[0], se[0], pointX)
  const y = lerp(nw[1], se[1], pointY)

  return viewport.unprojectFlat([x, y])
}

function getPoints(geometry: any, bbox: number[][], viewport: Viewport) {
  return geometry.map((g: any) => Point(g, bbox, viewport))
}

function MultiPoint(multiPoint: any, bbox: number[][], viewport: Viewport) {
  return getPoints(multiPoint, bbox, viewport)
}

function LineString(line: any, bbox: number[][], viewport: Viewport) {
  return getPoints(line, bbox, viewport)
}

function MultiLineString(multiLineString: any, bbox: number[][], viewport: Viewport) {
  return multiLineString.map((lineString: any) => LineString(lineString, bbox, viewport))
}

function Polygon(polygon: any, bbox: number[][], viewport: Viewport) {
  return polygon.map((polygonRing: any) => getPoints(polygonRing, bbox, viewport))
}

function MultiPolygon(multiPolygon: any, bbox: number[][], viewport: Viewport) {
  return multiPolygon.map((polygon: any) => Polygon(polygon, bbox, viewport))
}

// copied from deck.gl geo-layers/src/mvt-layer/coordinate-transform as it not exported
export function transform(geometry: any, bbox: GeoBoundingBox, viewport: Viewport) {
  const nw = viewport.projectFlat([bbox.west, bbox.north])
  const se = viewport.projectFlat([bbox.east, bbox.south])
  const projectedBbox = [nw, se]

  return {
    ...geometry,
    coordinates: availableTransformations[geometry.type](
      geometry.coordinates,
      projectedBbox,
      viewport
    ),
  }
}

export function transformTileCoordsToWGS84(
  object: Feature,
  bbox: GeoBoundingBox,
  viewport: Viewport
): Feature {
  const feature = {
    ...(object || {}),
    geometry: {
      type: object.geometry.type,
      coordinates: transform(object.geometry, bbox, viewport).coordinates,
    },
  }

  // Object.defineProperty(feature.geometry, 'coordinates', {
  //   get: () => {
  //     const wgs84Geom = transform(object.geometry, bbox, viewport)
  //     return wgs84Geom.coordinates
  //   },
  // })

  return feature as Feature
}
