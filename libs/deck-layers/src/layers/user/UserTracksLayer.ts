import type { DefaultProps, Layer, LayerProps } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { PathLayerProps } from '@deck.gl/layers'
import { PathLayer } from '@deck.gl/layers'
import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { TrackSegment } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { geoJSONToSegments } from '@globalfishingwatch/data-transforms'
import type { UserTrackBinaryData, UserTrackRawData } from '@globalfishingwatch/deck-loaders'
import { UserTrackLoader } from '@globalfishingwatch/deck-loaders'

import { getLayerGroupOffset, hexToDeckColor, LayerGroup } from '../../utils'
import { MAX_FILTER_VALUE } from '../layers.config'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from '../vessel/vessel.config'
import type { GetSegmentsFromDataParams } from '../vessel/vessel.utils'

import type { UserTrackLayerProps } from './user.types'

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

export class UserTracksPathLayer<
  DataT = any,
  ExtraProps = Record<string, unknown>
> extends PathLayer<DataT, _UserTrackLayerProps<DataT> & ExtraProps> {
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
      startTime: startTime || -MAX_FILTER_VALUE,
      endTime: endTime || MAX_FILTER_VALUE,
      highlightStartTime,
      highlightEndTime,
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
    let totalCoordinatesLength = 0
    const rawDataIndexes = data.features.reduce((acc, feature: any, index: number) => {
      totalCoordinatesLength +=
        feature.geometry.type === 'MultiLineString' ? feature.geometry.coordinates.length : 1
      acc.push({ index, length: totalCoordinatesLength })
      return acc
    }, [] as RawDataIndex[])
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
    return this.props.color
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

  _getColorByLineIndex = (_: any, { index }: { index: number }) => {
    const featureIndex = this.state.rawDataIndexes.find(({ length }) => index < length)
      ?.index as number
    return hexToDeckColor(
      this.state.rawData?.features?.[featureIndex]?.properties?.color || this.props.color
    )
  }

  renderLayers() {
    const {
      color,
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
        getColor: singleTrack ? this._getColorByLineIndex : hexToDeckColor(color),
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
        updateTriggers: {
          getColor: [singleTrack, color],
        },
      })
    })
  }
}
