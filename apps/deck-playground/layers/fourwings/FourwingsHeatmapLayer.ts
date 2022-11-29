import { Color, CompositeLayer, GetPickingInfoParams, PickingInfo } from '@deck.gl/core/typed'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { Cell } from 'loaders/fourwings/fourwingsLayerLoader'
import FourwingsTileCellLayer from 'layers/fourwings/FourwingsHeatmapCellLayer'
import { FourwingsLayerProps } from './FourwingsLayer'

export type FourwingsHeatmapLayerProps = FourwingsLayerProps & {
  id: string
  tile: Tile2DHeader
  data: any
  cols: number
  rows: number
  colorDomain?: number[]
  colorRange?: Color[]
}

export const aggregateCell = (cell: Cell | TileCell, { minFrame, maxFrame }) => {
  if (!cell) return 0
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

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
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

  renderLayers() {
    const { data, maxFrame, minFrame, rows, cols, colorDomain, colorRange } = this.props
    if (!data || !colorDomain || !colorRange) {
      return
    }
    const FourwingsTileCellLayerClass = this.getSubLayerClass('cell', FourwingsTileCellLayer)
    return new FourwingsTileCellLayerClass(
      this.props,
      this.getSubLayerProps({
        id: `fourwings-tile-${this.props.tile.id}`,
        data: data,
        cols,
        rows,
        pickable: true,
        stroked: false,
        getFillColor: (cell) => getFillColor(cell, { minFrame, maxFrame, colorDomain, colorRange }),
        updateTriggers: {
          // This tells deck.gl to recalculate fillColor on changes
          getFillColor: [minFrame, maxFrame, colorDomain, colorRange],
        },
      })
    )
  }

  getData() {
    return this.props.data
  }
}
