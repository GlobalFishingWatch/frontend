import { CompositeLayer, DefaultProps, Layer, LayerProps, LayersList } from '@deck.gl/core/typed'
import { IconLayer } from '@deck.gl/layers/typed'

function createSVGIcon(d, highlightedVesselId) {
  let fill = 'rgba(255,0,555,1)'
  let stroke = 'none'
  if (highlightedVesselId) {
    if (d.properties.vesselId === highlightedVesselId) {
      fill = 'rgba(255,0,555,1)'
      stroke = '#FFFFFF'
    } else {
      fill = 'rgba(255,0,555,0.3)'
    }
  }
  return `
    <svg width="12" height="21" xmlns="http://www.w3.org/2000/svg">
      <path d="m6 .7 5.5 5.5v14L6 17.43.5 20.2V6.21L6 .7Z" stroke-width="2" stroke="${stroke}" fill="${fill}"/>
    </svg>
  `
}

// Note that a xml string cannot be directly embedded in a data URL
// it has to be either escaped or converted to base64.
function svgToDataURL(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export type VesselPositionsLayerProps<DataT = any> = LayerProps & {
  highlightedVesselId?: string
  onVesselHighlight?: (vesselId: string) => void
}

const defaultProps: DefaultProps<VesselPositionsLayerProps> = {
  onVesselHighlight: { type: 'accessor', value: (d) => d },
}

/** Render individual positions of the vessel as points. */
export class VesselPositionsLayer<ExtraProps = {}> extends CompositeLayer<
  VesselPositionsLayerProps & ExtraProps
> {
  static layerName = 'VesselPositionsLayer'
  static defaultProps = defaultProps

  getPickingInfo({ info }) {
    const vesselId = info.object?.properties?.vesselId
    if (vesselId) {
      this.props.onVesselHighlight(vesselId)
    } else if (this.props.highlightedVesselId) {
      this.props.onVesselHighlight(undefined)
    }
    return info
  }

  renderLayers(): Layer<{}> | LayersList {
    const IconLayerClass = this.getSubLayerClass('icons', IconLayer)
    return new IconLayerClass(this.props, {
      // data: this.props.data,
      // TODO: once the api returns the proper position remove this mock
      // data: [
      //   {
      //     type: 'Feature',
      //     geometry: { coordinates: [-7.767333984374999, 43.77629983898068] },
      //     properties: { vesselId: '12345654323' },
      //   },
      // ],
      id: `icons-${this.props.id}`,
      pickable: true,
      getPickingInfo: this.getPickingInfo,
      getIcon: (d) => {
        return {
          url: svgToDataURL(createSVGIcon(d, this.props.highlightedVesselId)),
          width: 12,
          height: 21,
        }
      },
      sizeScale: 1,
      getPosition: (d) => {
        if (d.properties.vesselId === this.props.highlightedVesselId) {
          return { ...d.geometry.coordinates, 2: 1 }
        }
        return d.geometry.coordinates
      },
      getSize: (d) => 21,
      getColor: (d) => [255, 140, 0],
      updateTriggers: {
        getIcon: [this.props.highlightedVesselId],
        getPosition: [this.props.highlightedVesselId],
      },
      // getAngle: (d) => d.properties.c,
    })
  }

  getTileData() {
    return this.props.data
  }
}
