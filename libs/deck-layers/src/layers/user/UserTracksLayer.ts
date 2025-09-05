import type { DefaultProps, Layer, LayerProps, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { PathLayerProps } from '@deck.gl/layers'
import { PathLayer } from '@deck.gl/layers'
import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { TrackSegment } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { geoJSONToSegments } from '@globalfishingwatch/data-transforms'
import type {
  UserTrackBinaryData,
  UserTrackFeature,
  UserTrackRawData,
} from '@globalfishingwatch/deck-loaders'
import { UserTrackLoader } from '@globalfishingwatch/deck-loaders'

import {
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  getLayerGroupOffset,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'
import type { ContextFeature, ContextSublayerCallbackParams } from '../context/context.types'
import { getContextId } from '../context/context.utils'
import { MAX_FILTER_VALUE } from '../layers.config'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from '../vessel/vessel.config'
import type { GetSegmentsFromDataParams } from '../vessel/vessel.utils'

import {
  cloneArrayBuffer,
  generateCacheKey,
  getCachedResponse,
  responseCache,
  startCacheCleanup,
} from './user.cache'
import type {
  UserLayerPickingInfo,
  UserLayerPickingObject,
  UserTrackLayerProps,
} from './user.types'

type _UserTrackLayerProps<DataT = any> = UserTrackLayerProps & PathLayerProps<DataT>
const defaultProps: DefaultProps<_UserTrackLayerProps> = {
  _pathType: 'open',
  loaders: [UserTrackLoader],
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  highlightStartTime: { type: 'number', value: 0, min: 0 },
  highlightEndTime: { type: 'number', value: 0, min: 0 },
  getPath: { type: 'accessor', value: (d) => d },
  getTimestamp: { type: 'accessor', value: (d) => d },
}

const uniformBlock = `
  uniform trackUniforms {
    uniform float startTime;
    uniform float endTime;
    uniform float highlightStartTime;
    uniform float highlightEndTime;
  } track;
`

const trackLayerUniforms = {
  name: 'track',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    startTime: 'f32',
    endTime: 'f32',
    highlightStartTime: 'f32',
    highlightEndTime: 'f32',
  },
}

export class UserTracksPathLayer<
  DataT = any,
  ExtraProps = Record<string, unknown>,
> extends PathLayer<DataT, _UserTrackLayerProps<DataT> & ExtraProps> {
  static layerName = 'UserTracksPathLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.modules = [...(shaders.modules || []), trackLayerUniforms]
    shaders.inject = {
      'vs:#decl': /*glsl*/ `
        in float instanceTimestamps;
        out float vTime;
      `,
      // Timestamp of the vertex
      'vs:#main-end': /*glsl*/ `
        vTime = instanceTimestamps;
        if(vTime > 0.0 && vTime > track.highlightStartTime && vTime < track.highlightEndTime) {
          gl_Position.z = 1.0;
        }
      `,
      'fs:#decl': /*glsl*/ `
        in float vTime;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': /*glsl*/ `
        if(vTime > 0.0 && (vTime < track.startTime || vTime > track.endTime)) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': /*glsl*/ `
        if (vTime > 0.0 && vTime > track.highlightStartTime && vTime < track.highlightEndTime) {
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

    if (this.state.model) {
      this.state.model.shaderInputs.setProps({
        track: {
          startTime: startTime || -MAX_FILTER_VALUE,
          endTime: endTime || MAX_FILTER_VALUE,
          highlightStartTime,
          highlightEndTime,
        },
      })
    }

    super.draw(params)
  }
}

type RawDataIndex = { index: number; length: number }
type UserTracksLayerState = {
  error: string
  rawData?: UserTrackRawData
  rawDataIndexes: RawDataIndex[]
  binaryData: UserTrackBinaryData
}

// Start cleanup when module loads
startCacheCleanup()

export class UserTracksLayer extends CompositeLayer<LayerProps & UserTrackLayerProps> {
  static layerName = 'UserTracksLayer'
  static defaultProps = defaultProps
  state!: UserTracksLayerState

  getPickingInfo = ({ info }: { info: PickingInfo<UserTrackFeature> }): UserLayerPickingInfo => {
    const feature = this.state.rawData?.features[info.index]
    // TODO: support multiple sublayers
    const layer = this.props.layers?.[0]
    const sublayer = layer?.sublayers?.[0]
    const color = sublayer?.color
    if (feature) {
      const object = {
        id: getContextId(feature as ContextFeature, layer.idProperty) || info.index,
        value: layer.valueProperties?.length
          ? feature?.properties[layer.valueProperties[0]]
          : undefined,
        title: this.props.id,
        color,
        layerId: this.props.id,
        datasetId: this.props.layers[0].datasetId,
        category: this.props.category,
        subcategory: this.props.subcategory,
      } as UserLayerPickingObject
      return { ...info, object }
    }
    return { ...info, object: undefined }
  }

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
    const cacheKey = generateCacheKey(url)
    const cachedResponse = getCachedResponse(cacheKey)
    if (cachedResponse) {
      return await this._processResponse(cachedResponse, loadOptions)
    }

    const response = await GFWAPI.fetch<any>(url, {
      signal,
      method: 'GET',
      responseType: 'arrayBuffer',
    })

    // Clone and store the response in cache to avoid detached ArrayBuffer issues
    responseCache.set(cacheKey, {
      response: cloneArrayBuffer(response),
      timestamp: Date.now(),
    })

    return await this._processResponse(response, loadOptions)
  }

  _processResponse = async (response: ArrayBuffer, loadOptions: any) => {
    // TODO: support multiple sublayers
    const filters = this.props.layers?.[0]?.sublayers?.[0]?.filters

    const userTracksLoadOptions = {
      ...loadOptions,
      userTracks: {
        filters: filters,
      },
    }
    const { data, binary } = await parse(response, UserTrackLoader, userTracksLoadOptions)
    let totalCoordinatesLength = 0
    const rawDataIndexes = data.features.reduce(
      (acc: RawDataIndex[], feature: any, index: number) => {
        totalCoordinatesLength +=
          feature.geometry.type === 'MultiLineString' ? feature.geometry.coordinates.length : 1
        acc.push({ index, length: totalCoordinatesLength })
        return acc
      },
      [] as RawDataIndex[]
    )

    this.setState({ rawData: data, binaryData: binary, rawDataIndexes })
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

  getColor() {
    // TODO: support multiple sublayers
    return this.props.layers?.[0]?.sublayers?.[0]?.color
  }

  getSegments(
    { includeMiddlePoints = false } = {} as Omit<GetSegmentsFromDataParams, 'properties'>
  ): TrackSegment[] {
    if (!this.state.rawData) return []

    const segmentsGeo = geoJSONToSegments(this.state.rawData, {
      onlyExtents: !includeMiddlePoints,
    })
    return segmentsGeo
  }

  getBbox() {
    const segments = this.getSegments({ includeMiddlePoints: true })
    if (!segments.length) return null

    const bbox = segments.reduce(
      (acc, segment) =>
        segment.reduce((acc, point) => {
          if (point.longitude! < acc[0]) acc[0] = point.longitude as number
          if (point.longitude! > acc[2]) acc[2] = point.longitude as number
          if (point.latitude! < acc[1]) acc[1] = point.latitude as number
          if (point.latitude! > acc[3]) acc[3] = point.latitude as number
          return acc
        }, acc),
      [Infinity, Infinity, -Infinity, -Infinity] as Bbox
    )
    return bbox
  }

  _getColor = (
    _: any,
    { layer, sublayer, index }: ContextSublayerCallbackParams<{ index: number }>
  ) => {
    const { highlightedFeatures, singleTrack } = this.props
    const featureIndex = this.state.rawDataIndexes.find(({ length }) => index < length)
      ?.index as number
    const currentFeature = this.state.rawData?.features?.[featureIndex]
    const isHighlighted = highlightedFeatures?.some(
      (feature) =>
        feature.id === currentFeature?.properties?.[layer.idProperty || 'id'] ||
        feature.id === currentFeature?.properties?.id
    )
    if (isHighlighted) {
      return COLOR_HIGHLIGHT_LINE
    }
    const color = singleTrack ? currentFeature?.properties?.color || sublayer.color : sublayer.color
    return hexToDeckColor(color)
  }

  renderLayers() {
    const {
      layers,
      startTime,
      endTime,
      highlightStartTime,
      highlightEndTime,
      singleTrack,
      highlightedFeatures,
    } = this.props

    return layers.map((layer) => {
      const sublayer = layer.sublayers?.[0]
      // TODO support multiple layers
      // return layer.sublayers.map((sublayer) => {
      const tilesUrl = new URL(layer.tilesUrl)
      const layerIdHash = `${layer.id}-${sublayer.id}-${Object.values(sublayer.filters || {}).join(',')}`
      // tilesUrl.searchParams.set('filters', Object.values(sublayer.filters || {}).join(','))

      const commonProps = {
        _pathType: 'open',
        widthUnits: 'pixels',
        widthScale: 1,
        startTime,
        endTime,
        wrapLongitude: true,
        widthMinPixels: 1,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
      } as _UserTrackLayerProps

      return [
        new UserTracksPathLayer<any>({
          ...commonProps,
          id: `${layerIdHash}-interactive`,
          data: this.state.binaryData,
          pickable: layer.pickable,
          getWidth: 5,
          getColor: COLOR_TRANSPARENT,
        }),
        new UserTracksPathLayer<any>({
          ...commonProps,
          id: layerIdHash,
          data: tilesUrl.toString(),
          fetch: this._fetch,
          highlightStartTime,
          highlightEndTime,
          onError: this._onLayerError,
          jointRounded: true,
          capRounded: true,
          getWidth: 1.5,
          getColor: (d, { index }) => this._getColor(d, { layer, sublayer, index }),
          updateTriggers: {
            getColor: [singleTrack, sublayer.color, highlightedFeatures],
          },
        }),
      ]
      // })
    })
  }
}
