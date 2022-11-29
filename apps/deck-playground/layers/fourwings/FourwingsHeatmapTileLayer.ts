import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { parseFourWings } from 'loaders/fourwings/fourwingsLayerLoader'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { aggregateCell, FourwingsHeatmapLayer } from 'layers/fourwings/FourwingsHeatmapLayer'
import {
  ACTIVITY_SWITCH_ZOOM_LEVEL,
  aggregateCellTimeseries,
  getURLFromTemplate,
} from 'layers/fourwings/fourwings.utils'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { HEATMAP_ID } from './FourwingsLayer'

export type FourwingsLayerResolution = 'default' | 'high'
export type FourwingsHeatmapTileLayerProps<DataT = any> = {
  resolution?: FourwingsLayerResolution
  minFrame: number
  maxFrame: number
  onDataLoad?: (data: DataT) => void
}

function getDataUrlByYear(tile: Tile2DHeader, year) {
  const url = `https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=${year}-01-01,${
    year + 1
  }-01-01&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001`

  return getURLFromTemplate(url, tile)
}

export class FourwingsHeatmapTileLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapTileLayer'
  colorRamp = { colorDomain: [], colorRange: [] }
  tilesLoaded: Record<string, boolean> = {}

  updateColorRamp = () => {
    const { maxFrame, minFrame } = this.props
    const viewportData = this.getData()
    if (viewportData?.length > 0) {
      const cells = viewportData.map((cell) => aggregateCell(cell, { minFrame, maxFrame }))
      const dataSampled = cells.length > 1000 ? sample(cells, 1000, Math.random) : cells
      // filter data to 2 standard deviations from mean to remove outliers
      const meanValue = mean(dataSampled)
      const standardDeviationValue = standardDeviation(dataSampled)
      const upperCut = meanValue + standardDeviationValue * 2
      const lowerCut = meanValue - standardDeviationValue * 2
      const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
      const stepsNum = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
      // using ckmeans as jenks
      const steps = ckmeans(dataFiltered, stepsNum).map(([clusterFirst]) =>
        parseFloat(clusterFirst.toFixed(3))
      )
      const colorRange = steps.map((s, i) => {
        const opacity = ((i + 1) / COLOR_RAMP_DEFAULT_NUM_STEPS) * 255
        return [255, 0, 255, opacity] as Color
      })
      // this.colorRampUpdated = true
      this.colorRamp = { colorDomain: steps, colorRange }
    }
  }

  getColorDomain = () => {
    return this.colorRamp.colorDomain
  }

  onDataLoad = (data, tile) => {
    this.tilesLoaded[tile.id] = true
    const allTilesLoaded = Object.values(this.tilesLoaded).every((loaded) => loaded === true)
    if (allTilesLoaded) {
      this.updateColorRamp()
      this.getTilesLayers().forEach((layer) => layer.setState({ ...this.colorRamp }))
      if (this.props.onDataLoad) {
        return this.props.onDataLoad(data)
      }
    }
  }

  onTileLoad = (tile) => {
    this.tilesLoaded[tile.id] = false
  }

  onTileUnload = (tile) => {
    delete this.tilesLoaded[tile.id]
  }

  async *_fetchHeatmapData(tile: Tile2DHeader) {
    const years = [2021, 2022]
    for (let i = 0; i < years.length; i++) {
      const year = years[i]
      const response = await fetch(getDataUrlByYear(tile, year))
      // const tileBbox = tile.bbox
      // const tileIndex = tile.index
      if (response.ok) {
        yield parseFourWings(await response.arrayBuffer())
      } else {
        yield []
      }
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const TileLayerClass = this.getSubLayerClass(HEATMAP_ID, TileLayer)
    return new TileLayerClass(
      this.props,
      this.getSubLayerProps({
        id: HEATMAP_ID,
        // tileSize: 256,
        minZoom: 0,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        opacity: 1,
        onTileLoad: this.onTileLoad,
        onTileUnload: this.onTileUnload,
        renderSubLayers: (props: any) => {
          return new FourwingsHeatmapLayer({
            ...props,
            data: this._fetchHeatmapData(props.tile),
            onDataLoad: (data) => this.onDataLoad(data, props.tile),
          })
        },
      })
    )
  }

  getTilesLayers() {
    const layer = this.getSubLayers().find(
      (l) => l.id === `${FourwingsHeatmapTileLayer.layerName}-${HEATMAP_ID}`
    ) as TileLayer
    if (layer) {
      return layer.state.tileset.tiles.flatMap((t) => t.layers || [])
    }
  }

  getData(): TileCell[] {
    const data = this.getTilesLayers().flatMap((l) =>
      (l.props.data || []).flatMap((d) => d.cells || [])
    )
    return data
    // const zoom = Math.round(this.context.viewport.zoom)
    // const offset = this.props.resolution === 'high' ? 1 : 0
    // return layer.getSubLayers().flatMap((l: FourwingsTileLayer) => {
    //   return l.props.tile.zoom === zoom + offset ? (l.getTileData().cells as TileCell[]) : []
    // })
  }

  getTimeseries() {
    const data = this.getData()
    if (data?.length) {
      const cells = aggregateCellTimeseries(data)
      return cells
    }
    return []
  }
}
