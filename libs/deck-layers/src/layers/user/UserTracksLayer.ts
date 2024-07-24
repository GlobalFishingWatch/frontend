import { CompositeLayer, DefaultProps, Layer, LayerProps } from '@deck.gl/core'
import { PathLayer, PathLayerProps } from '@deck.gl/layers'
import { parse } from '@loaders.gl/core'
import { UserTrackLoader, UserTrackRawData } from '@globalfishingwatch/deck-loaders'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { LINE_COLOR_BAR_OPTIONS } from '@globalfishingwatch/ui-components'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from '../vessel/vessel.config'
import { getLayerGroupOffset, hexToDeckColor, LayerGroup } from '../../utils'
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
  getPath: { type: 'accessor', value: (d) => d },
  getTimestamp: { type: 'accessor', value: (d) => d },
}

export class UserTracksPathLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  _UserTrackLayerProps<DataT> & ExtraProps
> {
  static layerName = 'UserTracksPathLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        in float instanceTimestamps;
        out float vTime;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `
        vTime = instanceTimestamps;
        if(vTime > 0.0 && vTime > highlightStartTime && vTime < highlightEndTime) {
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
        if(vTime > 0.0 && (vTime < startTime || vTime > endTime)) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': `
        if (vTime > 0.0 && vTime > highlightStartTime && vTime < highlightEndTime) {
          // color = vHighlightColor;
          color = vec4(${DEFAULT_HIGHLIGHT_COLOR_VEC.join(',')});
        }
      `,
    }
    return shaders
  }

  initializeState() {
    super.initializeState()
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
    }
  }

  draw(params: any) {
    const { startTime, endTime, highlightStartTime = 0, highlightEndTime = 0 } = this.props

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
      highlightStartTime,
      highlightEndTime,
    }
    super.draw(params)
  }
}

type UserTracksLayerState = {
  error: string
  rawData?: UserTrackRawData
}

export class UserTracksLayer extends CompositeLayer<LayerProps & UserTrackLayerProps> {
  static layerName = 'UserTracksLayer'
  static defaultProps = defaultProps
  state!: UserTracksLayerState

  _fetch = async (
    url: string,
    {
      signal,
      loadOptions,
    }: {
      layer: Layer
      signal?: AbortSignal
      loadOptions?: any
    }
  ) => {
    const urlObject = new URL(url)
    urlObject.searchParams.delete('filters')
    const response = await GFWAPI.fetch<any>(urlObject.toString(), {
      signal,
      method: 'GET',
      responseType: 'arrayBuffer',
    })

    const userTracksLoadOptions = {
      ...loadOptions,
      userTracks: {
        filters: this.props.filters,
      },
    }
    const { data, binary } = await parse(response, UserTrackLoader, userTracksLoadOptions)
    this.setState({ rawData: data })
    return binary
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  getError() {
    return this.state.error
  }

  getData() {
    return this.state.rawData
  }

  _getColor(index: number) {
    const { lineIdProperty, color } = this.props
    if (lineIdProperty) {
      return hexToDeckColor(LINE_COLOR_BAR_OPTIONS[index % LINE_COLOR_BAR_OPTIONS.length].value)
    }
    return hexToDeckColor(color)
  }

  renderLayers() {
    const {
      layers,
      filters,
      startTime,
      endTime,
      highlightStartTime,
      highlightEndTime,
      singleTrack,
    } = this.props
    return layers.map((layer) => {
      const tilesUrl = new URL(layer.tilesUrl)
      tilesUrl.searchParams.set('filters', Object.values(filters || {}).join(','))
      return new UserTracksPathLayer<any>({
        id: layer.id,
        data: tilesUrl.toString(),
        _pathType: 'open',
        fetch: this._fetch,
        widthUnits: 'pixels',
        widthScale: 1,
        startTime,
        endTime,
        highlightStartTime,
        highlightEndTime,
        onError: this._onLayerError,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        widthMinPixels: 1,
        getWidth: 1,
        getColor: (_, { index }) => this._getColor(index),
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
        updateTriggers: {
          getColor: [singleTrack],
        },
      })
    })
  }
}
