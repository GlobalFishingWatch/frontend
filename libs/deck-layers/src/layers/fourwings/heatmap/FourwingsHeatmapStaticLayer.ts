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
import { MVTLayer, TileLayer } from '@deck.gl/geo-layers'
import { debounce } from 'es-toolkit'
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
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { ColorRampId, getColorRamp } from '../../../utils/colorRamps'
import {
  COLOR_HIGHLIGHT_LINE,
  GFWMVTLoader,
  LayerGroup,
  getLayerGroupOffset,
  getSteps,
} from '../../../utils'
import {
  FOURWINGS_MAX_ZOOM,
  HEATMAP_API_TILES_URL,
  HEATMAP_STATIC_PROPERTY_ID,
  MAX_RAMP_VALUES,
} from '../fourwings.config'
import { GetViewportDataParams } from '../fourwings.types'
import { EMPTY_CELL_COLOR, filterCells, getZoomOffsetByResolution } from './fourwings-heatmap.utils'
import {
  FourwingsAggregationOperation,
  FourwingsHeatmapStaticLayerProps,
  FourwingsHeatmapStaticPickingInfo,
  FourwingsHeatmapStaticPickingObject,
  FourwingsHeatmapTileLayerProps,
  FourwingsTileLayerState,
} from './fourwings-heatmap.types'

const defaultProps: DefaultProps<FourwingsHeatmapStaticLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  maxZoom: FOURWINGS_MAX_ZOOM,
  aggregationOperation: FourwingsAggregationOperation.Sum,
  tilesUrl: HEATMAP_API_TILES_URL,
  resolution: 'default',
}

export class FourwingsHeatmapStaticLayer extends CompositeLayer<FourwingsHeatmapTileLayerProps> {
  static layerName = 'FourwingsHeatmapStaticLayer'
  static defaultProps = defaultProps

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      colorDomain: [],
      colorRanges: this._getColorRanges(),
      scales: [],
    }
  }

  _getState() {
    return this.state as FourwingsTileLayerState
  }

  _getColorRanges = () => {
    return this.props.sublayers.map(({ colorRamp }) =>
      getColorRamp({ rampId: colorRamp as ColorRampId })
    )
  }

  _calculateColorDomain = () => {
    // TODO use to get the real bin value considering the NO_DATA_VALUE and negatives
    // NO_DATA_VALUE = 0
    // SCALE_VALUE = 0.01
    // OFFSET_VALUE = 0
    const { minVisibleValue, maxVisibleValue } = this.props
    const currentZoomData = this.getData()
    if (!currentZoomData.length) {
      return this.getColorDomain()
    }
    const values = currentZoomData.flatMap((d) => d.properties?.[HEATMAP_STATIC_PROPERTY_ID] || [])
    const allValues =
      values.length > MAX_RAMP_VALUES
        ? values.filter((d, i) => filterCells(d, i, minVisibleValue, maxVisibleValue))
        : values

    return getSteps(allValues)
  }

  _updateColorDomain = () => {
    const colorDomain = this._calculateColorDomain() as number[]
    const colorRanges = this._getColorRanges()[0]
    if (colorDomain?.length && colorRanges?.length) {
      this.setState({ colorDomain, scales: [scaleLinear(colorDomain, colorRanges)] })
    }
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
    info: PickingInfo<FourwingsHeatmapStaticPickingObject>
  }): FourwingsHeatmapStaticPickingInfo => {
    if (!info.object) {
      info.object = {} as FourwingsHeatmapStaticPickingObject
    }
    const { minVisibleValue, maxVisibleValue } = this.props
    if (info.object?.properties?.[HEATMAP_STATIC_PROPERTY_ID]) {
      if (
        (minVisibleValue &&
          info.object?.properties?.[HEATMAP_STATIC_PROPERTY_ID] < minVisibleValue) ||
        (maxVisibleValue && info.object?.properties?.[HEATMAP_STATIC_PROPERTY_ID] > maxVisibleValue)
      ) {
        return { ...info, object: undefined } as any
      }
      info.object.properties.values = [[info.object.properties?.[HEATMAP_STATIC_PROPERTY_ID]]]
    }
    info.object.layerId = this.root.id
    info.object.sublayers = this.props.sublayers
    info.object.category = this.props.category
    info.object.subcategory = this.props.subcategory
    return info as FourwingsHeatmapStaticPickingInfo
  }

  getFillColor = (feature: Feature<Geometry, FourwingsStaticFeatureProperties>) => {
    const { scales } = this.state as FourwingsTileLayerState
    const scale = scales?.[0]
    if (
      !scale ||
      !feature.properties?.[HEATMAP_STATIC_PROPERTY_ID] ||
      (this.props.minVisibleValue &&
        feature.properties?.[HEATMAP_STATIC_PROPERTY_ID] < this.props.minVisibleValue) ||
      (this.props.maxVisibleValue &&
        feature.properties?.[HEATMAP_STATIC_PROPERTY_ID] > this.props.maxVisibleValue)
    ) {
      return EMPTY_CELL_COLOR
    }

    const color = scale(feature.properties?.[HEATMAP_STATIC_PROPERTY_ID])
    if (!color) {
      return EMPTY_CELL_COLOR
    }

    return [color.r, color.g, color.b, color.a * 255] as Color
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { minVisibleValue, maxVisibleValue, sublayers } = props
    const oldColors = oldProps.sublayers?.map(({ colorRamp }) => colorRamp).join(',')
    const colors = sublayers?.map(({ colorRamp }) => colorRamp).join(',')
    const isColorChanged = oldColors !== colors
    const isVisibleValuesChanged =
      minVisibleValue !== oldProps.minVisibleValue || maxVisibleValue !== oldProps.maxVisibleValue
    if (isVisibleValuesChanged || isColorChanged) {
      this._updateColorDomain()
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { tilesUrl, sublayers, resolution, minVisibleValue, maxVisibleValue, maxZoom } =
      this.props
    const { colorDomain, colorRanges } = this.state as FourwingsTileLayerState
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
        zoomOffset: getZoomOffsetByResolution(resolution),
        onViewportLoad: this._onViewportLoad,
        getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.HeatmapStatic, params),
        getFillColor: this.getFillColor,
        updateTriggers: {
          getFillColor: [colorDomain, colorRanges, minVisibleValue, maxVisibleValue],
        },
      }),
    ]

    const layerHighlightedFeature = this.props.highlightedFeatures?.find(
      (f) => f.layerId === this.root.id
    )

    if (layerHighlightedFeature) {
      layers.push(
        new PathLayer(
          this.props,
          this.getSubLayerProps({
            data: [layerHighlightedFeature],
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
      const offset = getZoomOffsetByResolution(this.props.resolution)
      return layer.getSubLayers().flatMap((l: any) => {
        if (l.props.tile.zoom === l.props.maxZoom) {
          return l.props.data
        }
        return l.props.tile.zoom === zoom + offset ? l.props.data : []
      }) as FourwingsStaticFeature[]
    }
    return [] as FourwingsStaticFeature[]
  }

  getViewportData(params = {} as GetViewportDataParams) {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    if (data?.length) {
      const dataFiltered = filterFeaturesByBounds({
        features: data,
        bounds: { north, south, west, east },
        ...params,
      })
      return dataFiltered as FourwingsFeature[]
    }
    return []
  }

  getFourwingsLayers() {
    return this.props.sublayers
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
