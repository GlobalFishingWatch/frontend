import type { DefaultProps, Layer, LayerProps, PickingInfo, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { PathLayerProps } from '@deck.gl/layers'
import { PathLayer } from '@deck.gl/layers'
import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { TrackSegment } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import {
  COORDINATE_PROPERTY_TIMESTAMP,
  geoJSONToSegments,
} from '@globalfishingwatch/data-transforms'
import type {
  UserTrackFeature,
  UserTrackLod,
  UserTrackRawData,
} from '@globalfishingwatch/deck-loaders'
import {
  getUserTrackLodIndex,
  USER_TRACK_LOD_LEVELS,
  UserTrackLoader,
} from '@globalfishingwatch/deck-loaders'

import { COLOR_HIGHLIGHT_LINE } from '#config/colors.config'
import { DEFAULT_ID_PROPERTY, MAX_FILTER_VALUE } from '#config/layers.config'
import { LayerGroup } from '#config/sort.config'
import type { ContextFeature, ContextSublayerCallbackParams } from '#layers/context/context.types'
import { getContextId } from '#layers/context/context.utils'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from '#layers/vessel/vessel.config'
import type { GetSegmentsFromDataParams } from '#layers/vessel/vessel.utils'
import { getNarrowestLonSpan } from '#layers/vessel/VesselTrackPathLayer'
import { getLayerGroupOffset, getUTCDateTime, hexToDeckColor } from '#utils'

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

/** Default `pickWidth`: how wide the hover target is, in pixels. */
const TRACK_PICK_WIDTH = 15
/** Default drawn width, in pixels. */
const TRACK_VISIBLE_WIDTH = 1.5

const defaultProps: DefaultProps<_UserTrackLayerProps> = {
  _pathType: 'open',
  pickWidth: { type: 'number', value: TRACK_PICK_WIDTH, min: 0 },
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
    uniform float pickWidthRatio;
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
    pickWidthRatio: 'f32',
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
      ...(shaders.inject || {}),
      'vs:#decl': /*glsl*/ `
        in float instanceTimestamps;
        out float vTime;
      `,
      // Widen the stroke to the hover target, but only in the picking pass. Keeps one layer
      // doing both jobs without paying for the wide band's fragments on every drawn frame.
      'vs:DECKGL_FILTER_SIZE': /*glsl*/ `
        if (picking.isActive > 0.5) {
          size *= track.pickWidthRatio;
        }
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
      'fs:#main-start': /*glsl*/ `
      // Drop the segments outside of the time window
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
    const {
      startTime,
      endTime,
      highlightStartTime = 0,
      highlightEndTime = 0,
      pickWidth = TRACK_PICK_WIDTH,
      getWidth,
    } = this.props

    if (this.state.model) {
      this.state.model.shaderInputs.setProps({
        track: {
          startTime: startTime || -MAX_FILTER_VALUE,
          endTime: endTime || MAX_FILTER_VALUE,
          highlightStartTime,
          highlightEndTime,
          // Read back from getWidth rather than assuming TRACK_VISIBLE_WIDTH, so a caller
          // drawing at another width still gets a `pickWidth`-wide hover target.
          pickWidthRatio:
            pickWidth / (typeof getWidth === 'number' ? getWidth : TRACK_VISIBLE_WIDTH),
        },
      })
    }

    super.draw(params)
  }
}

type UserTrackContextLayer = UserTrackLayerProps['layers'][number]
type UserTrackSublayer = UserTrackContextLayer['sublayers'][number]

type RawDataIndex = { index: number; length: number }
type UserTracksLayerState = {
  error: string
  rawData?: UserTrackRawData
  rawDataIndexes: RawDataIndex[]
  /** Path index -> feature index. Avoids a linear scan per path in `_getColor`. */
  pathFeatureIndexes?: Int32Array
  /** Coarse-to-fine simplified copies; the last entry is the unsimplified original. */
  lods?: UserTrackLod[]
  /** Index into `lods` currently being drawn, derived from viewport zoom. */
  lodIndex?: number
  /** Identity of what `lods`/`rawData` were parsed from, so a filter change invalidates them. */
  dataKey?: string
  highlightedFeatures?: UserLayerPickingObject[]
  highlightStartTime?: number
  highlightEndTime?: number
}

const emptyHighlightedFeatures = [] as UserLayerPickingObject[]

// Start cleanup when module loads
startCacheCleanup()

export class UserTracksLayer extends CompositeLayer<LayerProps & UserTrackLayerProps> {
  static layerName = 'UserTracksLayer'
  static defaultProps = defaultProps
  declare state: UserTracksLayerState

  /**
   * Base `Layer.shouldUpdateState` only reports `propsOrDataChanged`, so without this
   * `renderLayers` never re-runs on a pure zoom change and the LOD would never switch.
   * Compared against the level index rather than a viewport hash, so this fires at
   * bucket boundaries instead of on every frame of a zoom.
   */
  shouldUpdateState(params: UpdateParameters<this>) {
    return super.shouldUpdateState(params) || this._getLodIndex() !== this.state?.lodIndex
  }

  updateState(params: UpdateParameters<this>) {
    super.updateState(params)
    // Filters/tilesUrl feed the parse, so anything already parsed is stale once they change.
    // Without this the sublayers keep rendering `state.lods` and never refetch.
    const dataKey = this._getDataKey()
    if (dataKey !== this.state?.dataKey) {
      this.setState({
        dataKey,
        rawData: undefined,
        rawDataIndexes: [],
        pathFeatureIndexes: undefined,
        lods: undefined,
        lodIndex: undefined,
      })
      return
    }
    const lodIndex = this._getLodIndex()
    if (lodIndex !== this.state?.lodIndex) {
      this.setState({ lodIndex })
    }
  }

  _getLayerKey(layer?: UserTrackContextLayer, sublayer?: UserTrackSublayer) {
    return [
      layer?.id,
      sublayer?.id,
      layer?.tilesUrl,
      Object.entries(sublayer?.filters || {}).join(','),
      Object.entries(sublayer?.filterOperators || {}).join(','),
      this.props.timeFilterType ?? '',
    ].join('|')
  }

  _getDataKey() {
    // TODO: support multiple sublayers
    const layer = this.props.layers?.[0]
    return this._getLayerKey(layer, layer?.sublayers?.[0])
  }

  _getLodIndex() {
    return getUserTrackLodIndex(
      this.state?.lods ?? USER_TRACK_LOD_LEVELS,
      this.context.viewport.zoom
    )
  }

  _getHighlightedFeatures() {
    return this.state?.highlightedFeatures || emptyHighlightedFeatures
  }

  setHighlightedFeatures(highlightedFeatures: UserLayerPickingObject[]) {
    if (!this.state) {
      return
    }
    this.setState({ highlightedFeatures })
  }

  _getHighlightTimes() {
    return {
      highlightStartTime: this.state.highlightStartTime ?? this.props.highlightStartTime,
      highlightEndTime: this.state.highlightEndTime ?? this.props.highlightEndTime,
    }
  }

  setHighlightedTime({ start, end }: { start?: number; end?: number }) {
    if (!this.state) {
      return
    }
    this.setState({
      highlightStartTime: start,
      highlightEndTime: end,
    })
  }

  _getTrackFeatureValueProperty = (
    feature: UserTrackFeature,
    featureIndex: number,
    pathIndex: number,
    property: string
  ): string | number | undefined => {
    if (!property || !feature) {
      return undefined
    }
    const properties = feature.properties as any
    const featureValue = properties?.[property]
    if (featureValue !== undefined) {
      return featureValue
    }
    const coordinateValues = properties?.coordinateProperties?.[property]
    if (coordinateValues === undefined) {
      return undefined
    }
    if (Array.isArray(coordinateValues) && Array.isArray(coordinateValues[0])) {
      const previousLength =
        featureIndex > 0 ? (this.state?.rawDataIndexes?.[featureIndex - 1]?.length ?? 0) : 0
      const lineValues = coordinateValues[pathIndex - previousLength] ?? coordinateValues.flat()
      return Array.isArray(lineValues) ? lineValues[0] : lineValues
    }
    return Array.isArray(coordinateValues) ? coordinateValues[0] : coordinateValues
  }

  getPickingInfo = ({ info }: { info: PickingInfo<UserTrackFeature> }): UserLayerPickingInfo => {
    const featureIndex = this._getFeatureIndex(info.index)
    const feature =
      featureIndex !== undefined ? this.state?.rawData?.features[featureIndex] : undefined
    // TODO: support multiple sublayers
    const layer = this.props.layers?.[0]
    const sublayer = layer?.sublayers?.[0]
    const color = sublayer?.color
    if (feature) {
      const valueProperties = layer.valueProperties || []
      const properties = valueProperties.reduce(
        (acc, property) => {
          acc[property] = this._getTrackFeatureValueProperty(
            feature,
            featureIndex as number,
            info.index,
            property
          )
          return acc
        },
        {} as Record<string, string | number | undefined>
      )
      const object = {
        id: this.props.id,
        properties,
        value: valueProperties.length ? properties[valueProperties[0]] : undefined,
        title: getContextId(feature as ContextFeature, layer.idProperty) || featureIndex,
        color,
        layerId: this.props.id,
        datasetId: this.props.layers[0].datasetId,
        dataviewId: this.props.layers[0].sublayers?.[0].dataviewId,
        valueProperties: layer.valueProperties,
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
    const filterOperators = this.props.layers?.[0]?.sublayers?.[0]?.filterOperators

    const userTracksLoadOptions = {
      ...loadOptions,
      userTracks: {
        filters: filters,
        filterOperators: filterOperators,
        includeCoordinateProperties: this.props.timeFilterType
          ? [COORDINATE_PROPERTY_TIMESTAMP]
          : [],
      },
    }
    const { data, lods } = await parse(response, UserTrackLoader, userTracksLoadOptions)
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
    const pathFeatureIndexes = new Int32Array(totalCoordinatesLength)
    let pathCursor = 0
    for (const { index, length } of rawDataIndexes) {
      while (pathCursor < length) {
        pathFeatureIndexes[pathCursor] = index
        pathCursor++
      }
    }

    const lodIndex = this._getLodIndex()
    this.setState({
      dataKey: this._getDataKey(),
      rawData: data,
      rawDataIndexes,
      pathFeatureIndexes,
      lods,
      lodIndex,
    })
    return lods[lodIndex].binary
  }

  _getFeatureIndex(pathIndex: number): number | undefined {
    if (pathIndex < 0) {
      return undefined
    }
    const pathFeatureIndexes = this.state?.pathFeatureIndexes
    if (!pathFeatureIndexes) {
      return undefined
    }
    return pathIndex < pathFeatureIndexes.length ? pathFeatureIndexes[pathIndex] : undefined
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  getError() {
    return this.state?.error
  }

  getData() {
    return this.state?.rawData
  }

  getColor() {
    // TODO: support multiple sublayers
    return this.props.layers?.[0]?.sublayers?.[0]?.color
  }

  getSegments(
    { includeMiddlePoints = false } = {} as Omit<GetSegmentsFromDataParams, 'properties'>
  ): TrackSegment[] {
    if (!this.state?.rawData) {
      return []
    }

    const segmentsGeo = geoJSONToSegments(this.state.rawData, {
      onlyExtents: !includeMiddlePoints,
    })
    return segmentsGeo
  }

  getBbox(params = {} as { startDate?: number | string; endDate?: number | string }) {
    const features = this.state?.rawData?.features
    if (!features?.length) return null

    const startDate = params?.startDate ? getUTCDateTime(params.startDate).toMillis() : undefined
    const endDate = params?.endDate ? getUTCDateTime(params.endDate).toMillis() : undefined

    let minLon = Infinity
    let maxLon = -Infinity
    let minLat = Infinity
    let maxLat = -Infinity
    let minShiftedLon = Infinity
    let maxShiftedLon = -Infinity

    const addLine = (coordinates: number[][], timestamps?: number[]) => {
      for (let i = 0; i < coordinates.length; i++) {
        const timestamp = timestamps?.[i]
        if (timestamp !== undefined && timestamp !== null) {
          if (startDate && timestamp < startDate) continue
          if (endDate && timestamp > endDate) continue
        }
        const longitude = coordinates[i][0]
        const latitude = coordinates[i][1]
        const shiftedLon = longitude < 0 ? longitude + 360 : longitude
        if (longitude < minLon) minLon = longitude
        if (longitude > maxLon) maxLon = longitude
        if (latitude < minLat) minLat = latitude
        if (latitude > maxLat) maxLat = latitude
        if (shiftedLon < minShiftedLon) minShiftedLon = shiftedLon
        if (shiftedLon > maxShiftedLon) maxShiftedLon = shiftedLon
      }
    }

    for (const feature of features) {
      const times = feature.properties?.coordinateProperties?.[COORDINATE_PROPERTY_TIMESTAMP]
      if (feature.geometry.type === 'MultiLineString') {
        // times is indexed per line for MultiLineString
        feature.geometry.coordinates.forEach((line, index) => addLine(line, times?.[index]))
      } else {
        addLine(feature.geometry.coordinates, times)
      }
    }

    if (minLon === Infinity) return null

    const [west, east] = getNarrowestLonSpan(minLon, maxLon, minShiftedLon, maxShiftedLon)
    return [west, minLat, east, maxLat] as Bbox
  }

  _getColor = (
    _: any,
    { layer, sublayer, index }: ContextSublayerCallbackParams<{ index: number }>
  ) => {
    const { singleTrack } = this.props
    const highlightedFeatures = this._getHighlightedFeatures()
    const featureIndex = this._getFeatureIndex(index) as number
    const currentFeature = this.state?.rawData?.features?.[featureIndex]
    const isHighlighted = highlightedFeatures?.some(
      (feature) =>
        feature.id === currentFeature?.properties?.[layer.idProperty || DEFAULT_ID_PROPERTY] ||
        feature.id === currentFeature?.properties?.id
    )
    if (isHighlighted) {
      return COLOR_HIGHLIGHT_LINE
    }
    const color = singleTrack ? currentFeature?.properties?.color || sublayer.color : sublayer.color
    return hexToDeckColor(color)
  }

  renderLayers() {
    const { layers, startTime, endTime, singleTrack } = this.props
    const { highlightStartTime, highlightEndTime } = this._getHighlightTimes()
    const highlightedFeatures = this._getHighlightedFeatures()

    return layers.map((layer) => {
      const sublayer = layer.sublayers?.[0]
      const tilesUrl = new URL(layer.tilesUrl)
      const layerIdHash = this._getLayerKey(layer, sublayer)

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

      const activeBinary = this.state?.lods?.[this.state?.lodIndex ?? 0]?.binary

      return [
        new UserTracksPathLayer<any>({
          ...commonProps,
          id: layerIdHash,
          data: activeBinary ?? tilesUrl.toString(),
          fetch: this._fetch,
          pickable: layer.pickable,
          highlightStartTime,
          highlightEndTime,
          onError: this._onLayerError,
          jointRounded: true,
          getWidth: TRACK_VISIBLE_WIDTH,
          getColor: (d, { index: pathIndex }) =>
            this._getColor(d, { layer, sublayer, index: pathIndex }),
          updateTriggers: {
            getColor: [singleTrack, sublayer.color, highlightedFeatures],
          },
        }),
      ]
      // })
    })
  }
}
