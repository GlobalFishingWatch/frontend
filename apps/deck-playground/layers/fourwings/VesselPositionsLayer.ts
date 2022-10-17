import {
  Color,
  CompositeLayer,
  CompositeLayerProps,
  DefaultProps,
  Layer,
  LayerProps,
  LayersList,
  UpdateParameters,
} from '@deck.gl/core/typed'
import { IconLayer } from '@deck.gl/layers/typed'

function getFillColor(
  d,
  { colorDomain, colorRange, highlightedVesselId }: VesselPositionsLayerProps
) {
  const colorIndex = colorDomain.findIndex((domain, i) => {
    if (colorDomain[i + 1]) {
      return d.properties?.value > domain && d.properties?.value <= colorDomain[i + 1]
    }
    return i
  })
  const color = colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
  if (!highlightedVesselId) {
    return color
  } else if (d.properties.vesselId !== highlightedVesselId) {
    return [color[0], color[1], color[2], 0]
  }
  return color
}

const ICON_MAPPING = {
  vessel: { x: 0, y: 0, width: 22, height: 40, mask: true },
  vesselHighlight: { x: 24, y: 0, width: 22, height: 40, mask: false },
}

export type VesselPositionsLayerProps<DataT = any> = LayerProps & {
  data: any[]
  colorDomain: number[]
  colorRange: Color[]
  highlightedVesselId?: string
  onVesselHighlight?: (vesselId: string) => void
  onVesselClick?: (vesselId: string) => void
}

const defaultProps: DefaultProps<VesselPositionsLayerProps> = {
  highlightedVesselId: { type: 'data', value: '' },
  onVesselHighlight: { type: 'accessor', value: (d) => d },
}

/** Render individual positions of the vessel as points. */
export class VesselPositionsLayer<ExtraProps = {}> extends CompositeLayer<
  VesselPositionsLayerProps & ExtraProps
> {
  static layerName = 'VesselPositionsLayer'
  static defaultProps = defaultProps

  getPickingInfo({ info, mode }) {
    const vesselId = info.object?.properties?.vesselId
    if (vesselId) {
      this.props.onVesselHighlight(vesselId)
      if (mode === 'query') {
        console.log(info.object?.properties)
        this.props.onVesselClick(vesselId)
      }
    } else if (this.props.highlightedVesselId) {
      this.props.onVesselHighlight(undefined)
    }
    return info
  }

  updateState(
    params: UpdateParameters<
      Layer<
        LayerProps<any> &
          VesselPositionsLayerProps &
          ExtraProps &
          Required<CompositeLayerProps<any>>
      >
    >
  ): void {
    const highlightVessels = params.props.data.filter(
      (d) => d.properties.vesselId === this.props.highlightedVesselId
    )
    this.setState({ highlightVessels })
  }

  renderLayers(): Layer<{}> | LayersList {
    const IconLayerClass = this.getSubLayerClass('icons', IconLayer)
    console.log(this.state.highlightVessels)

    return [
      new IconLayerClass(this.props, {
        id: `icons-${this.props.id}`,
        // data: this.props.data,
        pickable: true,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getPickingInfo: this.getPickingInfo,
        getIcon: () => 'vessel',
        sizeScale: 1,
        getPosition: (d) => ({ ...d.geometry.coordinates, 2: 1 }),
        getAngle: (d) => d?.properties.bearing,
        getColor: (d) => getFillColor(d, this.props),
        getSize: 21,
        updateTriggers: {
          getColor: [this.props.colorDomain, this.props.colorRange, this.props.highlightedVesselId],
        },
      }),
      new IconLayerClass(this.props, {
        id: `icons-highlight-${this.props.id}`,
        pickable: true,
        data: this.state.highlightVessels,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getPickingInfo: this.getPickingInfo,
        getIcon: () => 'vesselHighlight',
        sizeScale: 1,
        getPosition: (d) => d.geometry.coordinates,
        getAngle: (d) => d?.properties.bearing,
        // getColor: (d) => {
        //   return getFillColor(d.properties?.value, this.props)
        // },
        getSize: 25,
        // updateTriggers: {
        //   getIcon: [this.props.highlightedVesselId],
        //   getPosition: [this.props.highlightedVesselId],
        // },
        // getAngle: (d) => d.properties.c,
      }),
    ]
  }

  getTileData() {
    return this.props.data
  }
}
