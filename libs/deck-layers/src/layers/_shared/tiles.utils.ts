import type { CoordinateSystem, Viewport } from '@deck.gl/core'
import { ClipExtension } from '@deck.gl/extensions'
import type {
  _Tile2DHeader as Tile2DHeader,
  GeoBoundingBox,
  TileLayerProps,
} from '@deck.gl/geo-layers'
import { lerp, Matrix4 } from '@math.gl/core'
import type { Feature } from 'geojson'

const WORLD_SIZE = 512

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

const availableTransformations: Record<any, any> = {
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
}

export function getMVTSublayerProps({
  tile,
  extensions,
}: {
  tile: Tile2DHeader
  extensions?: TileLayerProps['extensions']
}): {
  modelMatrix: Matrix4
  coordinateOrigin: [number, number, number]
  coordinateSystem: CoordinateSystem
  extensions: any[]
} {
  const { x, y, z } = tile.index
  const worldScale = Math.pow(2, z)
  const xScale = WORLD_SIZE / worldScale
  const yScale = -xScale
  const xOffset = (WORLD_SIZE * x) / worldScale
  const yOffset = WORLD_SIZE * (1 - y / worldScale)
  const modelMatrix = new Matrix4().scale([xScale, yScale, 1])
  return {
    modelMatrix: modelMatrix,
    coordinateOrigin: [xOffset, yOffset, 0],
    coordinateSystem: 'cartesian',
    extensions: [...(extensions || []), new ClipExtension()],
  }
}

// copied from deck.gl geo-layers/src/mvt-layer/coordinate-transform as it not exported
export function transformCoordinates(geometry: any, bbox: GeoBoundingBox, viewport: Viewport) {
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

export function transformTileCoordsToWGS84<T extends Feature>(
  object: T,
  bbox: GeoBoundingBox,
  viewport: Viewport
): T {
  const feature = {
    ...(object || {}),
    geometry: {
      type: object.geometry.type,
      coordinates: transformCoordinates(object.geometry, bbox, viewport).coordinates,
    },
  }

  return feature as T
}
