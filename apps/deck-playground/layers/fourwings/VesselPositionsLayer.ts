import type { NumericArray } from '@math.gl/core'
import {
  AccessorFunction,
  CompositeLayer,
  DefaultProps,
  Layer,
  LayersList,
} from '@deck.gl/core/typed'
import { IconLayer, PathLayer, PathLayerProps } from '@deck.gl/layers/typed'
import { Segment } from '@globalfishingwatch/api-types'

function createSVGIcon(vesselId: string) {
  const ids = vesselId.split('-')
  return `
    <svg width="12" height="21" xmlns="http://www.w3.org/2000/svg">
    <path d="m6 .7 5.5 5.5v14L6 17.43.5 20.2V6.21L6 .7Z" stroke="#002458" fill="#01FBC1" fill-rule="nonzero"/>
    </svg>
  `
}

// Note that a xml string cannot be directly embedded in a data URL
// it has to be either escaped or converted to base64.
function svgToDataURL(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const defaultProps: DefaultProps<VesselPositionsLayerProps> = {}

export type VesselPositionsLayerProps<DataT = any> = {}

/** Render individual positions of the vessel as points. */
export class VesselPositionsLayer<ExtraProps = {}> extends CompositeLayer<
  Required<VesselPositionsLayerProps> & ExtraProps
> {
  static layerName = 'VesselPositionsLayer'
  static defaultProps = defaultProps

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
      // getPickingInfo: (pickParams) => { return },
      getIcon: (d) => {
        return {
          url: svgToDataURL(createSVGIcon(d.properties.vesselId)),
          width: 12,
          height: 21,
        }
      },
      sizeScale: 1,
      getPosition: (d) => {
        return d.geometry.coordinates
        // return d.coordinates
      },
      getSize: (d) => 21,
      getColor: (d) => [255, 140, 0],
      // getAngle: (d) => d.properties.c,
    })
  }

  getTileData() {
    return this.props.data
  }
}
