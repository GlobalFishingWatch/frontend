import type {
  Color,
  DefaultProps,
  LayerContext,
  LayerProps,
  PickingInfo,
  UpdateParameters,
} from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  DEFAULT_BACKGROUND_COLOR,
  getLayerGroupOffset,
  getPickedFeatureToHighlight,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'
import { PREVIEW_BUFFER_GENERATOR_ID } from '../layers.config'

import type {
  PolygonFeature,
  PolygonPickingInfo,
  PolygonPickingObject,
  PolygonsLayerProps,
} from './polygons.types'

const DEFAULT_DEBOUNCE_TIME = 1000
const defaultProps: DefaultProps<PolygonsLayerProps> = {
  pickable: true,
  debounceTime: DEFAULT_DEBOUNCE_TIME,
}

type PolygonsLayerState = {
  error: string
  debouncedDataUrl?: string
  _dataDebounceId?: ReturnType<typeof setTimeout>
}

export class PolygonsLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  PolygonsLayerProps & PropsT
> {
  static layerName = 'PolygonsLayer'
  static defaultProps = defaultProps
  state!: PolygonsLayerState

  constructor(props: PolygonsLayerProps & PropsT) {
    ;(props as LayerProps).onDataLoad = () => {
      this.setState({ error: '' })
    }
    ;(props as LayerProps).onError = (error: Error) => {
      this.setState({ error: error.message })
    }
    super(props as any)
    this.state = { error: '' }
  }

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    const { dataUrl } = this.props
    if (typeof dataUrl === 'string') {
      this.setState({ debouncedDataUrl: dataUrl })
    }
  }

  updateState({ props, oldProps, changeFlags }: UpdateParameters<this>): void {
    super.updateState?.({ props, oldProps, changeFlags } as UpdateParameters<this>)
    const { dataUrl, debounceTime = DEFAULT_DEBOUNCE_TIME } = props
    const { debouncedDataUrl, _dataDebounceId } = this.state

    if (!dataUrl) {
      if (_dataDebounceId != null) {
        clearTimeout(_dataDebounceId)
        this.setState({ _dataDebounceId: undefined })
      }
      return
    }

    if (dataUrl === debouncedDataUrl) {
      return
    }

    if (_dataDebounceId != null) {
      clearTimeout(_dataDebounceId)
    }

    const id = setTimeout(() => {
      this.setState({
        debouncedDataUrl: this.props.dataUrl,
        _dataDebounceId: undefined,
      })
    }, debounceTime)
    this.setState({ _dataDebounceId: id })
  }

  finalizeState(context: LayerContext): void {
    const { _dataDebounceId } = this.state
    if (_dataDebounceId != null) {
      clearTimeout(_dataDebounceId)
    }
    super.finalizeState(context)
  }

  get cacheHash(): string {
    return this.state.error
  }

  getPickingInfo = ({ info }: { info: PickingInfo<PolygonFeature> }): PolygonPickingInfo => {
    if (!info.object) return { ...info, object: undefined }

    const object = {
      ...info.object,
      color: this.props.color,
      layerId: this.props.id,
      category: this.props.category,
      title: info.object?.properties?.label || info.object?.properties?.title || this.props.id,
    } as PolygonPickingObject

    return { ...info, object }
  }

  getFillColor(d: PolygonFeature): Color {
    return d.properties?.highlighted ||
      getPickedFeatureToHighlight(d, this.props.highlightedFeatures)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  getHighlightLineWidth(d: PolygonFeature, lineWidth = 2): number {
    return d.properties?.highlighted ||
      getPickedFeatureToHighlight(d, this.props.highlightedFeatures)
      ? lineWidth
      : 0
  }

  renderLayers() {
    const {
      id,
      color,
      data,
      dataUrl,
      group = LayerGroup.OutlinePolygonsBackground,
      highlightedFeatures = [],
    } = this.props

    const dataToRender =
      dataUrl && typeof dataUrl === 'string'
        ? (this.state.debouncedDataUrl ?? dataUrl)
        : (data as FeatureCollection<Geometry, GeoJsonProperties>)

    const showHighlight =
      (dataToRender as FeatureCollection<Geometry, GeoJsonProperties>)?.features?.some(
        (d) => d.properties?.highlighted
      ) ||
      (highlightedFeatures && highlightedFeatures?.length > 0)

    return [
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-highlight-fills`,
        stroked: false,
        data: dataToRender,
        pickable: this.props.pickable,
        getPolygonOffset: (params) => getLayerGroupOffset(group, params),
        getFillColor: (d) => this.getFillColor(d as PolygonFeature),
        updateTriggers: {
          getFillColor: [highlightedFeatures],
        },
      }),
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-lines`,
        data: dataToRender,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 0,
        lineWidthMaxPixels: 2,
        filled: false,
        getPolygonOffset: (params) => getLayerGroupOffset(group, params),
        getLineWidth: id === PREVIEW_BUFFER_GENERATOR_ID ? 2 : 1,
        getLineColor: hexToDeckColor(color),
      }),
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-highlight-lines-bg`,
        data: dataToRender,
        lineWidthMinPixels: 0,
        lineWidthUnits: 'pixels',
        filled: false,
        lineJointRounded: true,
        lineCapRounded: true,
        visible: showHighlight,
        getPolygonOffset: (params) =>
          getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
        getLineWidth: (d) => this.getHighlightLineWidth(d as PolygonFeature, 4),
        getLineColor: DEFAULT_BACKGROUND_COLOR,
        updateTriggers: {
          getLineWidth: [highlightedFeatures],
        },
      }),
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-highlight-lines-fg`,
        data: dataToRender,
        lineWidthMinPixels: 0,
        lineWidthUnits: 'pixels',
        filled: false,
        lineJointRounded: true,
        lineCapRounded: true,
        visible: showHighlight,
        getPolygonOffset: (params) =>
          getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
        getLineWidth: (d) => this.getHighlightLineWidth(d as PolygonFeature, 2),
        getLineColor: COLOR_HIGHLIGHT_LINE,
        updateTriggers: {
          getLineWidth: [highlightedFeatures],
        },
      }),
    ]
  }
}
