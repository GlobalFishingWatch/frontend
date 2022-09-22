import { CompositeLayer, DefaultProps, Layer, LayerProps, LayersList } from '@deck.gl/core/typed'
import { IconLayer } from '@deck.gl/layers/typed'

function getFillColor(value, { colorDomain, colorRange }) {
  const colorIndex = colorDomain.findIndex((d, i) => {
    if (colorDomain[i + 1]) {
      return value > d && value <= colorDomain[i + 1]
    }
    return i
  })
  return colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
}

function createSVGIcon(d, props) {
  let [r, g, b, a] = getFillColor(d.properties?.value, props)
  let fill = `rgba(${r}, ${g}, ${b}, ${a / 255})`
  let opacity = 1
  let stroke = 'none'
  if (props.highlightedVesselId) {
    if (d.properties.vesselId === props.highlightedVesselId) {
      stroke = '#FFFFFF'
    } else {
      opacity = 0.3
    }
  }
  return `
    <svg width="12" height="21" xmlns="http://www.w3.org/2000/svg">
      <g opacity="${opacity}">
        <path d="m6 .7 5.5 5.5v14L6 17.43.5 20.2V6.21L6 .7Z" stroke-width="2" stroke="${stroke}" fill="${fill}"/>
      </g>
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
  onVesselClick?: (vesselId: string) => void
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
          url: svgToDataURL(createSVGIcon(d, this.props)),
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
      getAngle: (d) => {
        return d?.properties.bearing
      },
      getSize: 21,
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
