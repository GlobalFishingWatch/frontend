import { CSVLoader } from '@loaders.gl/csv'
import { GeoJsonLayerProps, IconLayer } from '@deck.gl/layers/typed'
import { CompositeLayer } from '@deck.gl/core/typed'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

const ICON_MAPPING = {
  vessel: { x: 0, y: 0, width: 22, height: 40, mask: true },
  vesselHighlight: { x: 24, y: 0, width: 22, height: 40, mask: false },
  arrow: { x: 6, y: 0, width: 10, height: 30, mask: true },
  circle: { x: 46, y: 0, width: 17, height: 17, mask: true },
}

export type LatestPositionsLayerProps = GeoJsonLayerProps & {
  zoom: number
}
export class LatestPositions extends CompositeLayer<LatestPositionsLayerProps> {
  static layerName = 'LatestPositionsLayer'
  static defaultProps = {
    zoom: 0,
  }

  layers = []

  renderLayers() {
    console.log(255 / Math.min(255, Math.max(1, 10 - this.props.zoom)))

    // const IconLayerClass = this.getSubLayerClass('icons', IconLayer)

    return new IconLayer({
      id: 'latest-positions',
      data: './positions/latest-positions-all.csv',
      loaders: [CSVLoader],
      iconAtlas: './positions/vessel-sprite.png',
      iconMapping: ICON_MAPPING,
      zIndex: GROUP_ORDER.indexOf(Group.Point),
      // onDataLoad: this.props.onDataLoad,
      onDataLoad: (data) => {
        console.log(data)
      },
      getIcon: (d) => (this.props.zoom <= 3 || parseInt(d.speed) === 0 ? 'circle' : 'arrow'),
      getPosition: (d) => [d.lon, d.lat],
      getColor: () => [255, 0, 255, 255 / Math.min(255, Math.max(1, 10 - this.props.zoom))],
      getSize: (d) =>
        Math.max(
          parseInt(d.speed) === 0 ? 1 : 3,
          Math.min(this.props.zoom * 2, parseInt(d.speed) === 0 ? 7 : 20)
        ),
      getAngle: (d) => d.course,
      pickable: true,
      getPickingInfo: this.getPickingInfo,
      updateTriggers: {
        getIcon: [this.props.zoom],
        getColor: [this.props.zoom],
        getSize: [this.props.zoom],
      },
    })

    // return new ScatterplotLayer({
    //   id: 'latest-positions',
    //   data: './positions/latest-positions-sample-more-columns.csv',
    //   loaders: [CSVLoader],
    //   maxZoom: 8,
    //   onDataLoad: this.props.onDataLoad,
    //   zIndex: GROUP_ORDER.indexOf(Group.Point),
    //   getRadius: () => Math.max(1, Math.min(this.props.zoom, 6)),
    //   radiusUnits: 'pixels',
    //   getPosition: (d) => [d.lon, d.lat],
    //   getFillColor: () => [255, 0, 255, 255 / Math.min(255, 8 - this.props.zoom)],
    //   getLineColor: [0, 0, 0, 30],
    //   pickable: true,
    //   updateTriggers: {
    //     getRadius: [this.props.zoom],
    //     getFillColor: [this.props.zoom],
    //   },
    // } as any)
  }
}
