import { CompositeLayer, DefaultProps, Layer, LayerProps } from '@deck.gl/core'
import { PathLayer, PathLayerProps } from '@deck.gl/layers'
import { UserTrackLoader } from '@globalfishingwatch/deck-loaders'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from '../vessel/vessel.config'
import { UserTrackLayerProps } from './user.types'

type _UserTrackLayerProps<DataT = any> = UserTrackLayerProps & PathLayerProps<DataT>
const defaultProps: DefaultProps<_UserTrackLayerProps> = {
  _pathType: 'open',
  idProperty: 'gfw_id',
  valueProperties: [],
  loaders: [UserTrackLoader],
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  highlightStartTime: { type: 'number', value: 0, min: 0 },
  highlightEndTime: { type: 'number', value: 0, min: 0 },
  getPath: { type: 'accessor', value: () => [0, 0] },
  getTimestamp: { type: 'accessor', value: (d) => d },
}

export class UserTracksPathLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  _UserTrackLayerProps<DataT> & ExtraProps
> {
  static layerName = 'UserTracksLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        // TODO:deck add dynamic filters here
        in float instanceTimestamps;
        out float vTime;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `
        vTime = instanceTimestamps;
        if(vTime > highlightStartTime && vTime < highlightEndTime) {
          gl_Position.z = 1.0;
        }
      `,
      'fs:#decl': `
        uniform float startTime;
        uniform float endTime;
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        in float vTime;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': `
        if(vTime < startTime || vTime > endTime) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': `
        if (vTime > highlightStartTime && vTime < highlightEndTime) {
          // color = vHighlightColor;
          color = vec4(${DEFAULT_HIGHLIGHT_COLOR_VEC.join(',')});
        }
      `,
    }
    return shaders
  }

  initializeState() {
    super.initializeState()
    console.log(this.props)
    const attributeManager = this.getAttributeManager()
    if (attributeManager) {
      attributeManager.addInstanced({
        timestamps: {
          size: 1,
          accessor: 'getTimestamp',
          shaderAttributes: {
            instanceTimestamps: {},
          },
        },
      })
      // TODO:deck make this dynamic
      // attributeManager.addInstanced({
      //   speeds: {
      //     size: 1,
      //     accessor: 'getSpeed',
      //     shaderAttributes: {
      //       instanceSpeeds: {},
      //     },
      //   },
      // })
    }
  }

  draw(params: any) {
    const {
      startTime,
      endTime,
      highlightStartTime = 0,
      highlightEndTime = 0,
      highlightColor,
    } = this.props

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

export class UserTracksLayer extends CompositeLayer<LayerProps & UserTrackLayerProps> {
  static layerName = 'UserTracksLayer'
  static defaultProps = defaultProps

  renderLayers() {
    const { layers, startTimeProperty } = this.props
    return layers.map((layer) => {
      return new UserTracksPathLayer<any>({
        ...(this.props as any),
        id: layer.id,
        data: layer.tilesUrl,
        loaders: [UserTrackLoader],
        loadOptions: {
          userTracks: {
            timestampProperty: startTimeProperty,
          },
        },
      })
    })
  }
}
