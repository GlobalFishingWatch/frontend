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
  getColor: any
  getTimestamps: any
  getPath: any
}

export const TRACK_LAYER_PREFIX = 'track'

const defaultProps: DefaultProps<VesselLayerProps> = {
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
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
      'vs:#decl': `\
attribute float instanceTimestamps;
attribute float instanceNextTimestamps;
varying float vTime;
`,
      // Timestamp of the vertex
      'vs:#main-end': `\
vTime = instanceTimestamps + (instanceNextTimestamps - instanceTimestamps) * vPathPosition.y / vPathLength;
`,
      'fs:#decl': `\
uniform float startTime;
uniform float endTime;
varying float vTime;
`,
      // Drop the segments outside of the time window
      'fs:#main-start': `\
if(vTime < startTime || vTime > endTime) {
discard;
}
`,
    }
    return shaders
  }

  initializeState() {
    super.initializeState()
    const attributeManager = this.getAttributeManager()
    console.log('🚀 ~ initializeState ~ attributeManager:', attributeManager)
    attributeManager.addInstanced({
      timestamps: {
        size: 1,
        // Start filling buffer from 1 vertex in
        vertexOffset: 1,
        // type: GL.INT,
        // fp64: this.use64bitPositions(),
        // transition: ATTRIBUTE_TRANSITION,
        accessor: 'getTimestamps',
        // eslint-disable-next-line @typescript-eslint/unbound-method
        // update: (attribute, { data, props, numInstances }) => {
        //   debugger
        // },
        // noAlloc,
        shaderAttributes: {
          instanceTimestamps: {
            vertexOffset: 0,
          },
          instanceNextTimestamps: {
            vertexOffset: 1,
          },
        },
      },
    })
  }

  draw(params) {
    const { startTime, endTime } = this.props

    const attributeManager = this.getAttributeManager()

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
    }

    super.draw(params)
  }
}
