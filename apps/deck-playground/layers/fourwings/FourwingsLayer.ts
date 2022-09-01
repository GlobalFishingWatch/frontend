import {
  Color,
  CompositeLayer,
  CompositeLayerProps,
  Layer,
  LayerContext,
  UpdateParameters,
} from '@deck.gl/core/typed'
// import { Layer } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { fourwingsLayerLoader } from 'loaders/fourwings/fourwingsLayerLoader'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { aggregateCell, FourwingsTileLayer } from 'layers/fourwings/FourwingsTileLayer'
import { filterCellsByBounds } from 'layers/fourwings/fourwings.utils'
import { debounce } from 'lodash'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'

export type FourwingsLayerProps = {
  minFrame: number
  maxFrame: number
  onViewportLoad: TileLayerProps['onViewportLoad']
}

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps> {
  state: {
    colorDomain?: number[]
    colorRange?: Color[]
  }

  initializeState(context: LayerContext): void {
    this.setState({ colorDomain: undefined, colorRange: undefined })
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
    const colorRange = steps.map((s, i) => {
      const opacity = ((i + 1) / COLOR_RAMP_DEFAULT_NUM_STEPS) * 255
      return [255, 0, 255, opacity]
    })

    this.setState({ colorDomain: steps, colorRange })
  }

  debouncedUpdateRampScale = debounce(() => {
    this.updateRampScale()
  }, 600)

  onViewportLoad: TileLayerProps['onViewportLoad'] = (tiles) => {
    this.debouncedUpdateRampScale()
    return this.props.onViewportLoad(tiles)
  }

  updateState(
    params: UpdateParameters<Layer<FourwingsLayerProps & Required<CompositeLayerProps<any>>>>
  ): void {
    const prevTimeRangeDuration = params.oldProps.maxFrame - params.oldProps.minFrame
    const newTimeRangeDuration = params.props.maxFrame - params.props.minFrame
    if (prevTimeRangeDuration !== newTimeRangeDuration) {
      // this.updateRampScale()
    }
  }

  renderLayers() {
    const TileLayerClass = this.getSubLayerClass('tiles', TileLayer)
    return [
      new TileLayerClass(
        this.props,
        this.getSubLayerProps({
          id: 'tile',
          data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=2022-01-01,2022-08-25&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001',
          minZoom: 0,
          maxZoom: 8,
          tileSize: 256,
          zoomOffset: -1,
          opacity: 1,
          loaders: [fourwingsLayerLoader],
          loadOptions: { worker: false },
          onViewportLoad: this.onViewportLoad,
          renderSubLayers: (props) => {
            const { maxFrame, minFrame } = this.props
            return new FourwingsTileLayer({
              maxFrame,
              minFrame,
              colorDomain: this.state.colorDomain,
              colorRange: this.state.colorRange,
              ...props,
            })
          },
        })
      ),
    ]
  }

  getData() {
    return (this.getSubLayers()[0] as TileLayer)
      .getSubLayers()
      .flatMap((l: FourwingsTileLayer) => l.getTileData().cells)
  }

  getColorDomain() {
    return this.state?.colorDomain
  }

  getDataFilteredByViewport() {
    const data = this.getData()
    // const { viewport } = this.context
    // const [west, north] = viewport.unproject([0, 0])
    // const [east, south] = viewport.unproject([viewport.width, viewport.height])
    // const filter = filterCellsByBounds(data, { north, west, south, east })
    return data
  }
}
