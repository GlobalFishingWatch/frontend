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
  <svg width="107px" height="107px" viewBox="0 0 107 107" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group" transform="translate(1.000000, 1.000000)" fill-rule="nonzero">
              <circle id="Oval" stroke="#FFAA11" stroke-width="2" fill="#CC0000" cx="52.5" cy="52.5" r="52.5"></circle>
              <text id="ef7cf9dfc-c54f-8222-" fill="#FFFFFF" font-family="Helvetica" font-size="12" font-weight="normal">
                  <tspan x="0" y="49">${ids[0]}-${ids[1]}-</tspan>
                  <tspan x="0" y="59">${ids[2]}-${ids[3]}</tspan>
              </text>
          </g>
      </g>
  </svg>`
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
    return new IconLayerClass({
      // data: this.props.data,
      // TODO: once the api returns the proper position remove this mock
      data: [
        {
          type: 'Feature',
          geometry: { coordinates: [-7.767333984374999, 43.77629983898068] },
          properties: { vesselId: '12345654323' },
        },
      ],
      id: `icons-${this.props.id}`,
      pickable: true,
      getIcon: (d) => {
        return {
          url: svgToDataURL(createSVGIcon(d.properties.vesselId)),
          width: 107,
          height: 107,
        }
      },
      sizeScale: 5,
      getPosition: (d) => {
        return d.geometry.coordinates
        // return d.coordinates
      },
      getSize: (d) => 10,
      getColor: (d) => [255, 140, 0],
      // getAngle: (d) => d.properties.c,
    })
  }

  getTileData() {
    return this.props.data
  }
}
