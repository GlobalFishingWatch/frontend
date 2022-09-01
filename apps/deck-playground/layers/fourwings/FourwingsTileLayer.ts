import { Color, CompositeLayer, GetPickingInfoParams, PickingInfo } from '@deck.gl/core/typed'
import { PolygonLayer } from '@deck.gl/layers/typed'
import { getTileCells, TileCell } from 'loaders/fourwings/fourwingsTileParser'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { FourwingsLayerProps } from 'layers/fourwings/FourwingsLayer'
import { Cell } from 'loaders/fourwings/fourwingsLayerLoader'

export type FourwingsTileLayerProps = FourwingsLayerProps & {
  id: string
  tile: Tile2DHeader
  data: any
  colorDomain?: number[]
  colorRange?: Color[]
}

export const aggregateCell = (cell: Cell | TileCell, { minFrame, maxFrame }) => {
  return cell.timeseries
    .filter(({ frame }) => frame >= minFrame && frame <= maxFrame)
    .reduce((acc, next) => acc + next.value, 0)
}

export const getFillColor = (
  cell: Cell,
  { minFrame, maxFrame, colorDomain, colorRange }
): Color => {
  const filteredCellValue = aggregateCell(cell, { minFrame, maxFrame })
  if (!colorDomain || !colorRange || !filteredCellValue) {
    return [0, 0, 0, 0]
  }
  const colorIndex = colorDomain.findIndex((d, i) => {
    if (colorDomain[i + 1]) {
      return filteredCellValue > d && filteredCellValue <= colorDomain[i + 1]
    }
    return i
  })
  return colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
}

export class FourwingsTileLayer extends CompositeLayer<FourwingsTileLayerProps> {
  getPickingInfo({ info }: GetPickingInfoParams): PickingInfo {
    const { minFrame, maxFrame } = this.props
    if (info.object) {
      const value = aggregateCell(info.object, { minFrame, maxFrame })
      info.object = {
        ...info.object,
        value,
      }
    }
    return info
  }
  // data = getTileCells(this.props.tile, this.props.data)
  renderLayers() {
    const { colorDomain, colorRange, maxFrame, minFrame } = this.props
    return new PolygonLayer(this.props, {
      id: `fourwings-tile-${this.props.tile.id}`,
      data: this.props.data.cells,
      pickable: true,
      stroked: false,
      // loaders: [fourwingsTileLoader(this.props.tile)],
      getPolygon: (d) => d.coordinates,
      getFillColor: (cell) => getFillColor(cell, { minFrame, maxFrame, colorDomain, colorRange }),
      updateTriggers: {
        // This tells deck.gl to recalculate radius when `currentYear` changes
        getFillColor: [minFrame, maxFrame, colorDomain, colorRange],
      },
      // bounds: [west, south, east, north],
    })
  }

  getTileData() {
    return this.props.data
  }
}
