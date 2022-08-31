import { Color, CompositeLayer, LayerContext } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { aggregateCell, FourwingsTileLayer } from 'layers/fourwings/FourwingsTileLayer'
import { filterCellsByBounds } from 'layers/fourwings/fourwings.utils'
import GPUGridLayer from 'layers/fourwings-gpu/gpu-grid-layer'
import { fourwingsGPULoader } from 'layers/fourwings-gpu/FourwingsGPULoader'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'

export type FourwingsLayerProps = {
  minFrame: number
  maxFrame: number
  onViewportLoad: TileLayerProps['onViewportLoad']
}

export class FourwingsGPULayer extends CompositeLayer<FourwingsLayerProps> {
  state: {
    colorDomain?: number[]
    colorRange?: Color[]
  }

  initializeState(context: LayerContext): void {
    this.setState({
      colorDomain: [8, 51, 85, 142, 193, 249, 381, 485, 690, 768],
      colorRange: [
        [255, 0, 255, 25.5],
        [255, 0, 255, 51],
        [255, 0, 255, 76.5],
        [255, 0, 255, 102],
        [255, 0, 255, 127.5],
        [255, 0, 255, 153],
        [255, 0, 255, 178.5],
        [255, 0, 255, 204],
        [255, 0, 255, 229.5],
        [255, 0, 255, 255],
      ],
    })
  }

  updateRampScale() {
    const { maxFrame, minFrame } = this.props
    const viewportData = this.getDataFilteredByViewport()
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
    console.log(steps)
    const colorRange = steps.map((s, i) => {
      const opacity = ((i + 1) / COLOR_RAMP_DEFAULT_NUM_STEPS) * 255
      return [255, 0, 255, opacity]
    })
    this.setState({ colorDomain: steps, colorRange })
  }

  // debouncedUpdateRampScale = debounce(() => {
  //   this.updateRampScale()
  // }, 600)

  onViewportLoad: TileLayerProps['onViewportLoad'] = (tiles) => {
    // this.debouncedUpdateRampScale()
    return this.props.onViewportLoad(tiles)
  }

  // updateState(
  //   params: UpdateParameters<Layer<FourwingsLayerProps & Required<CompositeLayerProps<any>>>>
  // ): void {
  //   if (params.changeFlags.propsChanged) {
  //     this.debouncedUpdateRampScale()
  //   }
  // }

  // renderLayersOld() {
  //   const TileLayerClass = this.getSubLayerClass('tiles', TileLayer)
  //   return [
  //     new TileLayerClass(
  //       this.props,
  //       this.getSubLayerProps({
  //         id: 'tile',
  //         data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=2022-07-01,2022-08-25&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001',
  //         minZoom: 0,
  //         maxZoom: 8,
  //         tileSize: 256,
  //         zoomOffset: -1,
  //         opacity: 1,
  //         loaders: [fourwingsLayerLoader],
  //         loadOptions: { worker: false },
  //         onViewportLoad: this.onViewportLoad,
  //         renderSubLayers: (props) => {
  //           const { maxFrame, minFrame } = this.props
  //           return new FourwingsTileLayer({
  //             maxFrame,
  //             minFrame,
  //             colorDomain: this.state.colorDomain,
  //             colorRange: this.state.colorRange,
  //             ...props,
  //           })
  //         },
  //       })
  //     ),
  //   ]
  // }

  renderLayers() {
    const TileLayerClass = this.getSubLayerClass('layer', TileLayer)
    return [
      new TileLayerClass(
        this.props,
        this.getSubLayerProps({
          id: 'tile',
          data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=2022-07-01,2022-08-25&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001',
          minZoom: 0,
          maxZoom: 8,
          tileSize: 256,
          zoomOffset: -1,
          opacity: 1,
          loaders: [fourwingsGPULoader],
          loadOptions: { worker: false },
          onViewportLoad: this.onViewportLoad,
          renderSubLayers: (props) => {
            // const GPUGridLayerClass = this.getSubLayerClass('tile', GPUGridLayer)
            // const data = getTileCellsCoordinates(props.tile, props.data)
            // * 111139 to convert degrees to meters
            if (!props.data) {
              return null
            }
            return new GPUGridLayer({
              id: props.tile.id,
              cellSize: props.data.width,
              data: props.data.cells,
              colorAggregation: 'SUM',
              pickable: true,
              minFrame: this.props.minFrame,
              maxFrame: this.props.maxFrame,
              // getTimestamp: (d) => d.timestamp,
              getElevationWeight: (d) => d.timestamp,
              getPosition: (d) => d.coordinates,
              getColorWeight: (d) => d.value,
              colorDomain: [this.state.colorDomain[0], this.state.colorDomain[9]],
              colorRange: this.state.colorRange,
            })
          },
        })
      ),
    ]
  }

  getData() {
    return (this.getSubLayers()[0] as TileLayer)
      .getSubLayers()
      .flatMap((l: FourwingsTileLayer) => l.getTileData())
  }

  getColorDomain() {
    return this.state?.colorDomain
  }

  getDataFilteredByViewport() {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    const filter = filterCellsByBounds(data, { north, west, south, east })
    return filter
  }
}
