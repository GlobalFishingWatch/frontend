import { COORDINATE_SYSTEM, PickingInfo } from '@deck.gl/core'
import { ClipExtension } from '@deck.gl/extensions'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { Matrix4 } from '@math.gl/core'

const WORLD_SIZE = 512

export function getPickedFeatureToHighlight(
  data: any,
  pickedFeatures: PickingInfo[],
  idProperty: string
) {
  return (
    pickedFeatures &&
    pickedFeatures.some(
      (f: PickingInfo) =>
        f.object.type === 'Feature' &&
        f.object.properties[idProperty] === data.properties[idProperty]
    )
  )
}

export function getMVTSublayerProps({
  tile,
  extensions,
}: {
  tile: Tile2DHeader
  extensions: TileLayerProps['extensions']
}): {
  modelMatrix: Matrix4
  coordinateOrigin: [number, number, number]
  coordinateSystem: 0 | 3 | 1 | -1 | 2 | undefined
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
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    extensions: [...(extensions || []), new ClipExtension()],
  }
}
