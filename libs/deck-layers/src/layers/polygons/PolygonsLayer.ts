import { CompositeLayer, DefaultProps } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import { PolygonsLayerProps } from '@globalfishingwatch/deck-layers'
import { hexToDeckColor, LayerGroup, getLayerGroupOffset } from '../../utils'

const defaultProps: DefaultProps<PolygonsLayerProps> = {}

export class PolygonsLayer<PropsT = {}> extends CompositeLayer<PolygonsLayerProps & PropsT> {
  static layerName = 'PolygonsLayer'
  static defaultProps = defaultProps

  renderLayers() {
    const { color, data, group = LayerGroup.OutlinePolygons } = this.props
    // TODO:deck implement highlightedFeatures
    return new GeoJsonLayer({
      data,
      id: `${this.props.id}-layer`,
      lineWidthMinPixels: 1,
      filled: false,
      getPolygonOffset: (params: { layerIndex: number }) => getLayerGroupOffset(group, params),
      getLineColor: hexToDeckColor(color),
      lineWidthUnits: 'pixels',
      lineJointRounded: true,
      lineCapRounded: true,
    })
  }
}
