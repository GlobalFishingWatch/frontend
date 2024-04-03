import {
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  Color,
  UpdateParameters,
  PickingInfo,
} from '@deck.gl/core'
import { scaleLinear } from 'd3-scale'
import { MVTLayer, TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { ckmeans } from 'simple-statistics'
import { debounce } from 'lodash'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { PathLayer } from '@deck.gl/layers'
import { stringify } from 'qs'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Feature, Geometry } from 'geojson'
import {
  FourwingsFeature,
  FourwingsStaticFeature,
  FourwingsStaticFeatureProperties,
} from '@globalfishingwatch/deck-loaders'
import {
  HEATMAP_COLOR_RAMPS,
  rgbaStringToComponents,
  ColorRampsIds,
} from '@globalfishingwatch/layer-composer'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '../../utils/colorRamps'
import {
  COLOR_HIGHLIGHT_LINE,
  GFWMVTLoader,
  LayerGroup,
  deckToRgbaColor,
  getLayerGroupOffset,
} from '../../utils'
import { EMPTY_CELL_COLOR, filterElementByPercentOfIndex } from './fourwings.utils'
import {
  FOURWINGS_MAX_ZOOM,
  HEATMAP_API_TILES_URL,
  MAX_RAMP_VALUES_PER_TILE,
} from './fourwings.config'
import {
  ColorRange,
  FourwingsHeatmapTileLayerProps,
  FourwingsTileLayerState,
  FourwingsAggregationOperation,
  FourwinsTileLayerScale,
  FourwingsHeatmapStaticLayerProps,
  FourwingsPickingInfo,
  FourwingsPickingObject,
} from './fourwings.types'

const defaultProps: DefaultProps<FourwingsHeatmapStaticLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  maxZoom: FOURWINGS_MAX_ZOOM,
  aggregationOperation: FourwingsAggregationOperation.Sum,
  tilesUrl: HEATMAP_API_TILES_URL,
  resolution: 'default',
}

export class FourwingsHeatmapStaticLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapStaticLayer'
  static defaultProps = defaultProps
  scale: typeof scaleLinear | undefined = undefined

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      colorDomain: [],
      colorRanges: this._getColorRanges(),
      scale: scaleLinear([], []),
    }
  }

  _getState() {
    return this.state as FourwingsTileLayerState
  }

  _getColorRanges = () => {
    return this.props.sublayers.map(
      ({ colorRamp }) =>
        HEATMAP_COLOR_RAMPS[colorRamp as ColorRampsIds].map((c) =>
          rgbaStringToComponents(c)
        ) as ColorRange
    )
  }

  _calculateColorDomain = () => {
    // TODO use to get the real bin value considering the NO_DATA_VALUE and negatives
    // NO_DATA_VALUE = 0
    // SCALE_VALUE = 0.01
    // OFFSET_VALUE = 0
    const currentZoomData = this.getData()
    if (!currentZoomData.length) {
      return this.getColorDomain()
    }
    const dataSample =
      currentZoomData.length > MAX_RAMP_VALUES_PER_TILE
        ? currentZoomData.filter(filterElementByPercentOfIndex)
        : currentZoomData

    const allValues = dataSample.flatMap((feature) => {
      if (
        (this.props.minVisibleValue && feature.properties.count < this.props.minVisibleValue) ||
        (this.props.maxVisibleValue && feature.properties.count > this.props.maxVisibleValue)
      ) {
        return []
      }
      return feature.properties?.count
    })

    const steps = ckmeans(allValues, Math.min(allValues.length, COLOR_RAMP_DEFAULT_NUM_STEPS)).map(
      (step) => step[0]
    )

    return steps
  }

  _updateColorDomain = () => {
    const colorDomain = this._calculateColorDomain() as number[]
    const colorRanges = this._getColorRanges()?.[0]?.map((c) => deckToRgbaColor(c))
    this.setState({ colorDomain, scale: scaleLinear(colorDomain, colorRanges) })
  }

  debouncedUpdateColorDomain = debounce(() => {
    requestAnimationFrame(this._updateColorDomain)
  }, 500)

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.debouncedUpdateColorDomain()
    if (this.props.onViewportLoad) {
      this.props.onViewportLoad(tiles)
    }
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<FourwingsPickingObject>
  }): FourwingsPickingInfo => {
    if (!info.object) {
      info.object = {} as FourwingsPickingObject
    }
    if (info.object?.properties?.count) {
      info.object.properties.values = [[info.object.properties.count]]
    }
    info.object.category = this.props.category
    return info
  }

  getFillColor = (feature: Feature<Geometry, FourwingsStaticFeatureProperties>) => {
    if (!this.state.scale) {
      return EMPTY_CELL_COLOR
    }
    if (!feature.properties.count) {
      // TODO make the filter for the visible data here
      return EMPTY_CELL_COLOR
    }
    if (
      (this.props.minVisibleValue && feature.properties.count < this.props.minVisibleValue) ||
      (this.props.maxVisibleValue && feature.properties.count > this.props.maxVisibleValue)
    ) {
      return EMPTY_CELL_COLOR
    }
    const value = (this.state.scale as FourwinsTileLayerScale)(feature.properties.count)
    if (!value) {
      return EMPTY_CELL_COLOR
    }
    return rgbaStringToComponents(value) as Color
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { minVisibleValue, maxVisibleValue } = props
    const isVisibleValuesChanged =
      minVisibleValue !== oldProps.minVisibleValue || maxVisibleValue !== oldProps.maxVisibleValue
    if (isVisibleValuesChanged) {
      this._updateColorDomain()
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { tilesUrl, sublayers, resolution, minVisibleValue, maxVisibleValue, maxZoom } =
      this.props
    const { colorDomain, colorRanges, scale } = this.state as FourwingsTileLayerState
    const params = {
      datasets: sublayers.flatMap((sublayer) => sublayer.datasets),
      format: 'MVT',
      'temporal-aggregation': true,
    }

    const layers: any[] = [
      new MVTLayer<FourwingsStaticFeatureProperties>(this.props as any, {
        id: `static-${resolution}`,
        data: `${tilesUrl}?${stringify(params)}`,
        maxZoom,
        binary: false,
        pickable: true,
        loaders: [GFWMVTLoader],
        zoomOffset: resolution === 'high' ? 1 : 0,
        onViewportLoad: this._onViewportLoad,
        getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.HeatmapStatic, params),
        getFillColor: this.getFillColor,
        updateTriggers: {
          getFillColor: [colorDomain, colorRanges, scale, minVisibleValue, maxVisibleValue],
        },
      }),
    ]

    const layerHoveredFeature: FourwingsStaticFeature = this.props.hoveredFeatures?.find(
      (f) => f.layer?.id === this.root.id
    )?.object

    if (layerHoveredFeature) {
      layers.push(
        new PathLayer(
          this.props,
          this.getSubLayerProps({
            data: [layerHoveredFeature],
            id: `fourwings-cell-highlight`,
            widthUnits: 'pixels',
            widthMinPixels: 4,
            getPath: (d: FourwingsFeature) => d.geometry.coordinates[0],
            getColor: COLOR_HIGHLIGHT_LINE,
            getOffset: 0.5,
            getPolygonOffset: (params: any) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
            extensions: [new PathStyleExtension({ offset: true })],
          })
        )
      )
    }

    return layers
  }

  getLayerInstance() {
    const layer = this.getSubLayers()[0] as TileLayer
    return layer
  }

  getData() {
    const layer = this.getLayerInstance()
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      const offset = this.props.resolution === 'high' ? 1 : 0
      return layer.getSubLayers().flatMap((l: any) => {
        if (l.props.tile.zoom === l.props.maxZoom) {
          return l.props.data()
        }
        return l.props.tile.zoom === zoom + offset ? l.props.data : []
      }) as FourwingsStaticFeature[]
    }
    return [] as FourwingsStaticFeature[]
  }

  getViewportData() {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    if (data?.length) {
      const dataFiltered = filterFeaturesByBounds(data, { north, south, west, east })
      return dataFiltered as FourwingsFeature[]
    }
    return []
  }

  getColorDomain = () => {
    return (this.state as FourwingsTileLayerState).colorDomain
  }

  getColorRange = () => {
    return (this.state as FourwingsTileLayerState).colorRanges
  }

  getColorScale = () => {
    return {
      range: this.getColorRange(),
      domain: this.getColorDomain(),
    }
  }
}