import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps, DefaultProps } from '@deck.gl/core/typed'
import GL from '@luma.gl/constants'
// Loaders
import { parquetLoader } from 'loaders/vessels/parquetLoader'
import { PathLayer } from '@deck.gl/layers/typed'
import { Segment } from '@globalfishingwatch/api-types'

export type VesselLayerProps = {
  startTime: number
  endTime: number
  highlightStartTime?: number
  highlightEndTime?: number
  getColor: any
  getTimestamps: any
  getPath: any
}

export const TRACK_LAYER_PREFIX = 'track'

const defaultProps: DefaultProps<VesselLayerProps> = {
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  highlightStartTime: { type: 'number', value: 0, min: 0 },
  highlightEndTime: { type: 'number', value: 0, min: 0 },
  getColor: { type: 'accessor', value: () => [255, 255, 255, 100] },
  getPath: { type: 'accessor', value: [0, 0] },
  getTimestamps: { type: 'accessor', value: (d) => d },
}

export class ParquetVesselLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  Required<VesselLayerProps> & ExtraProps
> {
  static layerName = 'VesselTrackLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        attribute float instanceTimestamps;
        varying float vTime;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `
        vTime = instanceTimestamps;
      `,
      'fs:#decl': `
        uniform float startTime;
        uniform float endTime;
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        uniform vec4 highlightColor;
        varying float vTime;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': `
        if(vTime < startTime || vTime > endTime) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': `
          if (vTime < highlightStartTime || vTime > highlightEndTime) {
            color = color;
          } else {
            color = vec4(highlightColor);
          }
        `,
    }
    return shaders
  }

  getSegments(): Segment[] {
    const data = this.props.data as any
    const segmentsIndex = data.startIndices
    const positions = data.attributes.positions.value
    const timestamps = data.attributes.getTimestamps.value
    const size = data.attributes.positions.size
    const segments = segmentsIndex.flatMap((segment, i) => {
      const point = {
        longitude: positions[segment],
        latitude: positions[segment + 1],
        timestamp: timestamps[segment / size],
        // segment,
      }
      if (i === 0) {
        return point
      }
      // Inserts first point of next segment
      return [
        point,
        {
          longitude: positions[segment + size],
          latitude: positions[segment + size + 1],
          timestamp: timestamps[segment / size + 1],
          // segment: segment + 1,
        },
      ]
    })
    // Close last segment point
    segments.push({
      longitude: positions[positions.length - size],
      latitude: positions[positions.length - 1],
      timestamp: timestamps[timestamps.length - 1],
      // segment: positions.length,
    })
    return segments
  }

  initializeState() {
    super.initializeState()
    const attributeManager = this.getAttributeManager()
    attributeManager.addInstanced({
      timestamps: {
        size: 1,
        accessor: 'getTimestamps',
        shaderAttributes: {
          instanceTimestamps: {},
        },
      },
    })
  }

  draw(params) {
    const { startTime, endTime, highlightStartTime, highlightEndTime, highlightColor } = this.props

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
      highlightStartTime,
      highlightEndTime,
      highlightColor,
    }
    super.draw(params)
  }
}
