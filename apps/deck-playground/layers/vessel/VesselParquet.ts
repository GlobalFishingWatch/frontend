import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps } from '@deck.gl/core/typed'
// Loaders
import { parquetLoader } from 'loaders/vessels/parquetLoader'
import { PathLayer } from '@deck.gl/layers/typed'
import { Segment } from '@globalfishingwatch/api-types'

export type VesselLayerProps = {}

export const TRACK_LAYER_PREFIX = 'track'

export class ParquetVesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  layersLoaded: Layer[] = []
  layers: Layer[] = []

  onDataLoad: LayerProps['onDataLoad'] = (data, context) => {
    console.log('data')
    console.log(data)
  }

  renderLayers() {
    return new PathLayer<Segment[]>(
      this.getSubLayerProps({
        id: `${TRACK_LAYER_PREFIX}-track-parquet-${this.props.id}`,
        data: 'http://localhost:8000/track.parquet',
        loaders: [parquetLoader],
        widthUnits: 'pixels',
        widthScale: 1,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        onDataLoad: this.onDataLoad,
        _pathType: 'open',
        // getPath: (d) => {
        //   debugger
        //   return d.waypoints.map((p) => [p.lon, p.lat])
        // },
        getColor: [255, 255, 255, 255],
        // return d.waypoints.map((p) => {
        //   if (
        //     p.timestamp >= this.props.highlightStartTime &&
        //     p.timestamp <= this.props.highlightEndTime
        //   ) {
        //     return [255, 0, 0, 100]
        //   }
        //   return [255, 255, 255, 100]
        // })
        // },
        getWidth: 3,
        // updateTriggers: {
        //   getColor: [this.props.highlightStartTime, this.props.highlightEndTime],
        // },
        // startTime: this.props.startTime,
        // endTime: this.props.endTime,
      })
    )
  }

  getTrackLayer() {
    return this.getSubLayers().find((l) => l.id.includes(TRACK_LAYER_PREFIX)) as ParquetVesselLayer
  }

  getVesselTrackData() {
    return this.getTrackLayer()
  }
}
