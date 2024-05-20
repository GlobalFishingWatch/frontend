import { CompositeLayer, DefaultProps } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import { PolygonsLayerProps } from '@globalfishingwatch/deck-layers'
import { hexToDeckColor, LayerGroup, getLayerGroupOffset } from '../../utils'

type _PolygonsLayerProps = PolygonsLayerProps

const defaultProps: DefaultProps<_PolygonsLayerProps> = {}

export class PolygonsLayer<PropsT = {}> extends CompositeLayer<_PolygonsLayerProps & PropsT> {
  static layerName = 'PolygonsLayer'
  static defaultProps = defaultProps

  renderLayers() {
    const { color, dataUrl } = this.props
    return new GeoJsonLayer({
      data: dataUrl,
      id: `${this.props.id}-layer`,
      lineWidthMinPixels: 1,
      filled: false,
      getPolygonOffset: (params: { layerIndex: number }) =>
        getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
      getLineColor: hexToDeckColor(color),
      lineWidthUnits: 'pixels',
      lineJointRounded: true,
      lineCapRounded: true,
    })
  }
}
