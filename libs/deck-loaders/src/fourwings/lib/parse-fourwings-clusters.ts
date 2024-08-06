import Pbf from 'pbf'
import { GeoBoundingBox } from '@deck.gl/geo-layers/dist/tileset-2d'
import { BBox, getCellPointCoordinates } from '../helpers/cells'
import type {
  FourwingsLoaderOptions,
  FourwingsRawData,
  ParseFourwingsClustersOptions,
  FourwingsClusterFeature,
} from './types'

const SCALE_VALUE = 1
const OFFSET_VALUE = 0
const CELL_NUM_INDEX = 0
const CELL_VALUE_INDEX = 1

export const getPoints = (
  intArray: FourwingsRawData,
  options?: FourwingsLoaderOptions
): FourwingsClusterFeature[] => {
  const {
    scale = SCALE_VALUE,
    offset = OFFSET_VALUE,
    tile,
    cols,
    rows,
  } = options?.fourwings || ({} as ParseFourwingsClustersOptions)

  const tileBBox: BBox = [
    (tile?.bbox as GeoBoundingBox).west,
    (tile?.bbox as GeoBoundingBox).south,
    (tile?.bbox as GeoBoundingBox).east,
    (tile?.bbox as GeoBoundingBox).north,
  ]
  const features = {} as Record<number, FourwingsClusterFeature>

  let cellNum = 0
  let indexInCell = 0
  const subLayerIntArray = intArray
  for (let i = 0; i < subLayerIntArray.length; i++) {
    const value = subLayerIntArray[i]
    if (indexInCell === CELL_NUM_INDEX) {
      // this number defines the cell number frame
      cellNum = value
    } else if (indexInCell === CELL_VALUE_INDEX) {
      // this number defines the cell value frame
      features[cellNum] = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getCellPointCoordinates({
            cellIndex: cellNum,
            cols,
            rows,
            tileBBox,
          }),
        },
        properties: {
          count: Math.round(offset + value * scale),
          id: `${tile!.index.z}/${tile!.index.x}/${tile!.index.y}/${cellNum}`,
          cellNum,
          cols,
          rows,
        },
      }
      // resseting indexInCell to start with the new cell
      indexInCell = -1
    }
    indexInCell++
  }
  return Object.values(features)
}

function readData(_: any, data: any, pbf: any) {
  data.push(pbf.readPackedVarint())
}

export const parseFourwingsClusters = (buffer: ArrayBuffer, options?: FourwingsLoaderOptions) => {
  return getPoints(new Pbf(buffer).readFields(readData, [])[0], options)
}
