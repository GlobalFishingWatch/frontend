import { Color, CompositeLayer } from '@deck.gl/core/typed'
import { PolygonLayer } from '@deck.gl/layers/typed'
import { getTileCells } from 'loaders/fourwings/fourwingsTileParser'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { FourwingsLayerProps } from 'layers/fourwings/FourwingsLayer'
import { Cell, FourwingsTileData } from 'loaders/fourwings/fourwingsLayerLoader'

export type FourwingsTileLayerProps = FourwingsLayerProps & {
  id: string
  tile: Tile2DHeader
  data: any
}

export const aggregateCell = (cell: Cell, { minFrame, maxFrame }) => {
  return cell.timeseries
    .filter(({ frame }) => frame >= minFrame && frame <= maxFrame)
    .reduce((acc, next) => acc + next.value, 0)
}

export const getFillColor = (cell: Cell, { minFrame, maxFrame }): Color => {
  const filteredCellValues = aggregateCell(cell, { minFrame, maxFrame })
  return filteredCellValues > 0
    ? [255, 0, 255, Math.floor(255 * (filteredCellValues / 2000))]
    : [0, 0, 0, 0]
}

export class FourwingsTileLayer extends CompositeLayer<FourwingsTileLayerProps> {
  data = getTileCells(this.props.tile, this.props.data)
  renderLayers() {
    const { maxFrame, minFrame } = this.props
    return new PolygonLayer(this.props, {
      id: `fourwings-tile-${this.props.tile.id}`,
      data: this.data,
      pickable: true,
      stroked: false,
      // loaders: [fourwingsTileLoader(this.props.tile)],
      getPolygon: (d) => d.coordinates,
      getFillColor: (cell) => getFillColor(cell, { minFrame, maxFrame }),
      updateTriggers: {
        // This tells deck.gl to recalculate radius when `currentYear` changes
        getFillColor: [minFrame, maxFrame],
      },
      // bounds: [west, south, east, north],
    })
  }

  getTileData() {
    return this.data
  }
}
