import type {
  Color,
  Layer,
  LayerProps,
  LayersList,
  PickingInfo,
  UpdateParameters,
} from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { DataFilterExtension } from '@deck.gl/extensions'
import { TextLayer } from '@deck.gl/layers'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { bearingToAzimuth, featureCollection, point } from '@turf/helpers'
import { rhumbBearing } from '@turf/turf'
import type { BBox, Position } from 'geojson'
import { extent } from 'simple-statistics'

import { THINNING_LEVELS } from '@globalfishingwatch/api-client'
import type { TrackSegment } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType, EventTypes } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import type { VesselDeckLayersEventData } from '@globalfishingwatch/deck-loaders'
import {
  getVesselGraphExtentClamped,
  VesselEventsLoader,
  VesselTrackLoader,
} from '@globalfishingwatch/deck-loaders'

import type { DeckLayerProps } from '../../types'
import {
  BLEND_BACKGROUND,
  getFetchLoadOptions,
  getLayerGroupOffset,
  LayerGroup,
  VESSEL_SPRITE_ICON_MAPPING,
} from '../../utils'
import { deckToHexColor, hexToDeckColor } from '../../utils/colors'
import { DECK_FONT, loadDeckFont } from '../../utils/fonts'
import { PATH_BASENAME } from '../layers.config'

import {
  DEFAULT_FISHING_EVENT_COLOR,
  EVENT_LAYER_TYPE,
  EVENTS_COLORS,
  TRACK_DEFAULT_THINNING,
  TRACK_DEFAULT_THINNING_CONFIG,
  TRACK_LAYER_TYPE,
} from './vessel.config'
import type {
  _VesselLayerProps,
  VesselDataType,
  VesselDeckLayersEvent,
  VesselEventPickingInfo,
  VesselEventPickingObject,
  VesselEventProperties,
} from './vessel.types'
import type { GetSegmentsFromDataParams } from './vessel.utils'
import { getEvents, getVesselResourceChunks } from './vessel.utils'
import type { _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselEventsLayer } from './VesselEventsLayer'
import { VesselPositionLayer } from './VesselPositionLayer'
import type { _VesselTrackLayerProps } from './VesselTrackLayer'
import { VesselTrackLayer } from './VesselTrackLayer'

export type VesselEventsLayerProps = Omit<_VesselEventsLayerProps, 'type'> & {
  events: VesselDeckLayersEvent[]
}

export type VesselLayerProps = DeckLayerProps<
  _VesselTrackLayerProps & VesselEventsLayerProps & _VesselLayerProps
>

type VesselLayerState = {
  fontLoaded: boolean
  colorDirty: boolean
  errors: {
    [key in EventTypes | 'track']?: string
  }
}
let warnLogged = false
export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  static layerName = 'VesselLayer'
  state!: VesselLayerState
  initializeState() {
    super.initializeState(this.context)
    const isSSR = typeof document === 'undefined'
    const fontLoaded = isSSR
    if (!isSSR) {
      loadDeckFont().then((loaded) => {
        this.setState({ fontLoaded: loaded })
      })
    }
    this.state = {
      colorDirty: false,
      fontLoaded,
      errors: {},
    }
  }

  get isLoaded(): boolean {
    return this.getAllSublayersLoaded() && this.state ? !this.state.colorDirty : false
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    // TODO:deck try to remove this workaround because we cannot find
    // why useTimebarVesselTracks is not updating on color change
    if (oldProps.color?.join('') !== props.color.join('')) {
      this.setState({ colorDirty: true })
      requestAnimationFrame(() => {
        this.setState({ colorDirty: false })
      })
    }
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<VesselEventProperties>
  }): VesselEventPickingInfo => {
    const object = {
      ...(info.object || ({} as VesselEventProperties)),
      layerId: this.root.id,
      title: this.props.name,
      vesselId: this.props.id,
      category: DataviewCategory.Vessels,
      subcategory: DataviewType.VesselEvents,
      color: deckToHexColor(this.props.color),
    }
    if (!info.object) {
      info.object = {} as VesselEventPickingObject
    }
    // info.object.getDetail = async () => {
    //   return GFWAPI.fetch(`/events/${info.object?.properties.id}`)
    // }
    return { ...info, object }
  }

  onSublayerError = (type: EventTypes | 'track', error: any) => {
    console.warn(error)
    this.setState({
      errors: { ...this.state.errors, [type]: error },
    })
    return true
  }

  _getTracksUrl({
    start,
    end,
    trackUrl,
    zoom,
    trackThinningZoomConfig = TRACK_DEFAULT_THINNING_CONFIG,
  }: {
    start: string
    end: string
    trackUrl: string
    zoom: number
    trackThinningZoomConfig?: _VesselTrackLayerProps['trackThinningZoomConfig']
  }) {
    const trackUrlObject = new URL(trackUrl)
    trackUrlObject.searchParams.append('start-date', start)
    trackUrlObject.searchParams.append('end-date', end)
    const thinningLevel =
      Object.entries(trackThinningZoomConfig)
        .sort(([zoomLevelA], [zoomLevelB]) => parseInt(zoomLevelA) - parseInt(zoomLevelB))
        .findLast(([zoomLevel]) => zoom >= parseInt(zoomLevel))?.[1] || TRACK_DEFAULT_THINNING

    Object.entries(THINNING_LEVELS[thinningLevel]).forEach(([key, value]) => {
      trackUrlObject.searchParams.set(key, value)
    })
    const format = trackUrlObject.searchParams.get('format') || 'DECKGL'
    if (format !== 'DECKGL' && !warnLogged) {
      console.warn(`only DECKGL format is supported, the current format (${format}) was replaced`)
      warnLogged = true
    }
    trackUrlObject.searchParams.set('format', 'DECKGL')
    return trackUrlObject.toString()
  }

  _getVesselTrackLayers() {
    const {
      trackUrl,
      visible,
      startTime,
      endTime,
      color,
      highlightStartTime,
      highlightEndTime,
      minSpeedFilter,
      maxSpeedFilter,
      trackThinningZoomConfig,
      minElevationFilter,
      maxElevationFilter,
      trackGraphExtent,
      colorBy,
    } = this.props

    if (!trackUrl || !visible) {
      if (!trackUrl) console.warn('trackUrl needed for vessel layer')
      return []
    }
    const { zoom } = this.context.viewport
    const chunks = getVesselResourceChunks(startTime, endTime)
    return chunks.flatMap(({ start, end }) => {
      if (!start || !end) {
        return []
      }
      const chunkId = `${TRACK_LAYER_TYPE}-${start}-${end}`
      return new VesselTrackLayer<any, { type: VesselDataType }>(
        this.getSubLayerProps({
          id: chunkId,
          visible,
          data: this._getTracksUrl({
            start,
            end,
            trackUrl,
            zoom,
            trackThinningZoomConfig,
          }),
          loadOptions: {
            ...getFetchLoadOptions(),
          },
          trackGraphExtent,
          type: TRACK_LAYER_TYPE,
          loaders: [VesselTrackLoader],
          _pathType: 'open',
          widthUnits: 'pixels',
          getWidth: 1.5,
          widthScale: 1,
          wrapLongitude: true,
          jointRounded: true,
          capRounded: true,
          getColor: color,
          colorBy,
          startTime,
          endTime,
          highlightStartTime,
          highlightEndTime,
          minSpeedFilter,
          maxSpeedFilter,
          minElevationFilter,
          maxElevationFilter,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
          onError: (e: any) => this.onSublayerError('track', e),
        } as _VesselTrackLayerProps)
      )
    })
  }

  _getVesselEventLayers(): VesselEventsLayer[] {
    const {
      visible,
      visibleEvents,
      startTime,
      endTime,
      highlightEventIds,
      events,
      highlightStartTime,
      highlightEndTime,
      singleTrack,
      color,
    } = this.props
    if (!visible) {
      return []
    }
    const chunks = getVesselResourceChunks(startTime, endTime)
    // return one layer with all events if we are consuming the data object from app resources
    return events?.flatMap(({ url, type }) => {
      const visible = visibleEvents?.includes(type)
      if (!visible) {
        return []
      }
      return chunks.map(({ start, end }) => {
        const chunkId = `${EVENT_LAYER_TYPE}-${type}-${start}-${end}`
        const eventUrl = new URL(url as string)
        eventUrl.searchParams.append('start-date', start as string)
        eventUrl.searchParams.append('end-date', end as string)
        return new VesselEventsLayer<VesselDeckLayersEventData[]>(
          this.getSubLayerProps({
            id: chunkId,
            data: eventUrl.toString(),
            loadOptions: {
              ...getFetchLoadOptions(),
            },
            visible,
            type,
            onError: (e: any) => this.onSublayerError(type, e),
            loaders: [VesselEventsLoader],
            pickable: true,
            highlightStartTime,
            highlightEndTime,
            getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
            getFillColor: (d: any): Color => {
              if (highlightEventIds?.includes(d.id)) return DEFAULT_FISHING_EVENT_COLOR
              if (d.type === EventTypes.Fishing) {
                return singleTrack ? DEFAULT_FISHING_EVENT_COLOR : color
              }
              return EVENTS_COLORS[d.type]
            },
            radiusUnits: 'pixels',
            getRadius: (d: any) => {
              const highlightOffset = highlightEventIds?.includes(d.id) ? 6 : 0
              return (d.type === EventTypes.Fishing ? 3 : 6) + highlightOffset
            },
            getFilterValue: (d: VesselDeckLayersEventData) => [d.start, d.end],
            filterRange: [
              [Number.MIN_SAFE_INTEGER, endTime] as any,
              [startTime, Number.MAX_SAFE_INTEGER],
            ],
            extensions: [new DataFilterExtension({ filterSize: 2 })],
            updateTriggers: {
              getFillColor: [color, highlightEventIds],
              getRadius: [highlightEventIds],
            },
          })
        )
      })
    })
  }

  _getVesselPositionLayer() {
    const { visible, highlightStartTime, highlightEndTime, color, name } = this.props
    const trackData = this.getVesselTrackData()
    if (!visible || !trackData?.length || !highlightEndTime || !highlightStartTime) {
      return []
    }
    const highlightCenter = highlightEndTime - (highlightEndTime - highlightStartTime) / 2
    let timestampIndex = -1
    const chunkIndex = trackData.findIndex((chunk) => {
      if (
        chunk.attributes &&
        chunk.attributes.getTimestamp.value[0] < highlightCenter &&
        chunk.attributes.getTimestamp.value[chunk.attributes.getTimestamp.value.length - 1] >
          highlightCenter
      ) {
        timestampIndex = chunk.attributes.getTimestamp.value.findIndex((t, i) => {
          return (
            !chunk.startIndices.includes(i) &&
            t > highlightCenter &&
            chunk.attributes.getTimestamp.value[i - 1] < highlightCenter
          )
        })
        return true
      } else {
        return false
      }
    })

    if (chunkIndex === -1 || timestampIndex === -1) return []

    const coordIndex = timestampIndex * 2
    const pointCoords = [
      trackData[chunkIndex].attributes.getPath.value[coordIndex],
      trackData[chunkIndex].attributes.getPath.value[coordIndex + 1],
    ]
    const nextPointCoords = [
      trackData[chunkIndex].attributes.getPath.value[coordIndex + 2],
      trackData[chunkIndex].attributes.getPath.value[coordIndex + 3],
    ]
    const pointBearing = rhumbBearing(pointCoords, nextPointCoords)
    const centerPoint = point(pointCoords, {
      course: 360 - bearingToAzimuth(pointBearing),
    })

    if (!centerPoint) return []
    return [
      new VesselPositionLayer(
        this.getSubLayerProps({
          id: 'vessel-position-bg',
          data: [centerPoint],
          iconAtlas: `${PATH_BASENAME}/vessel-sprite.png`,
          iconMapping: VESSEL_SPRITE_ICON_MAPPING,
          getIcon: () => 'vessel',
          getPosition: (d: any) => d.geometry.coordinates,
          getAngle: (d: any) => d.properties.course,
          getColor: hexToDeckColor(BLEND_BACKGROUND),
          getSize: 18,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
          transitions: {
            getPosition: 50,
          },
        })
      ),
      new VesselPositionLayer(
        this.getSubLayerProps({
          id: 'vessel-position',
          data: [centerPoint],
          iconAtlas: `${PATH_BASENAME}/vessel-sprite.png`,
          iconMapping: VESSEL_SPRITE_ICON_MAPPING,
          getIcon: () => 'vessel',
          getPosition: (d: any) => d.geometry.coordinates,
          getAngle: (d: any) => d.properties.course,
          getColor: color,
          getSize: 15,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
          transitions: {
            getPosition: 50,
          },
        })
      ),
      new VesselPositionLayer(
        this.getSubLayerProps({
          id: 'vessel-position-hg',
          data: [centerPoint],
          iconAtlas: `${PATH_BASENAME}/vessel-sprite.png`,
          iconMapping: VESSEL_SPRITE_ICON_MAPPING,
          getIcon: () => 'vesselHighlight',
          getPosition: (d: any) => d.geometry.coordinates,
          getAngle: (d: any) => d.properties.course,
          getColor: [255, 255, 255, 255],
          getSize: 15,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
          transitions: {
            getPosition: 50,
          },
        })
      ),
      ...(name
        ? [
            new TextLayer({
              id: `${this.props.id}-lastPositionsNames`,
              data: [centerPoint],
              getText: () => name,
              getPosition: (d) => d.geometry.coordinates,
              getPixelOffset: [0, -15],
              getColor: [255, 255, 255, 255],
              getSize: 14,
              outlineColor: hexToDeckColor(BLEND_BACKGROUND, 0.5),
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
              fontFamily: DECK_FONT,
              characterSet:
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789áàâãåäçèéêëìíîïñòóôöõøùúûüýÿÁÀÂÃÅÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÕØÙÚÛÜÝŸÑæÆ -./|',
              outlineWidth: 20,
              fontSettings: { sdf: true, smoothing: 0.2, buffer: 15 },
              sizeUnits: 'pixels',
              getTextAnchor: 'middle',
              getAlignmentBaseline: 'center',
              pickable: false,
              transitions: {
                getPosition: 50,
              },
            }),
          ]
        : []),
    ]
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    return [
      ...this._getVesselTrackLayers(),
      ...this._getVesselEventLayers(),
      ...this._getVesselPositionLayer(),
    ]
  }

  getTrackLayers() {
    return this.getSubLayers().filter((l) => l.id.includes(TRACK_LAYER_TYPE)) as VesselTrackLayer<
      TrackSegment[]
    >[]
  }

  getEventLayers() {
    return this.getSubLayers().filter((l) => l.id.includes(EVENT_LAYER_TYPE)) as VesselEventsLayer[]
  }

  getVesselName() {
    return this.props.name
  }

  getColor() {
    return deckToHexColor(this.props.color)
  }

  getFilters() {
    const { minSpeedFilter, maxSpeedFilter, minElevationFilter, maxElevationFilter } = this.props
    return {
      minSpeedFilter,
      maxSpeedFilter,
      minElevationFilter,
      maxElevationFilter,
    }
  }

  getVesselsData() {
    return this.getSubLayers().map((l) => l.props.data)
  }

  getVesselEventsData(types?: EventTypes[]) {
    return getEvents(this.getEventLayers(), {
      types,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
    })
  }

  getVesselTrackData() {
    return this.getTrackLayers()?.flatMap((l) => l.getData())
  }

  getVesselTrackSegments(params = {} as GetSegmentsFromDataParams) {
    return this.getTrackLayers()?.flatMap((l) => l.getSegments(params))
  }

  getVesselTrackGraphExtent(graph: 'speed' | 'elevation') {
    const extents = this.getTrackLayers()?.flatMap((l) => {
      return l.getGraphExtent(graph)
    })
    if (!extents?.length) return []
    return getVesselGraphExtentClamped(extent(extents), graph)
  }

  getVesselTrackBounds() {
    const trackLayerBboxes = this.getTrackLayers()
      .map((l) => l.getBbox())
      .filter(Boolean)
    if (!trackLayerBboxes.length) return null
    if (trackLayerBboxes.length === 1) return trackLayerBboxes[0]
    return bbox(featureCollection([...trackLayerBboxes.map((l) => bboxPolygon(l as BBox))])) as Bbox
  }

  getVesselEventsBounds() {
    const { startTime, endTime } = this.props
    const events = this.getVesselEventsData()
    const filteredEvents = events
      .filter(
        (event) =>
          (!endTime || (event.start as number) < endTime) &&
          (!startTime || (event.end as number) > startTime)
      )
      .map((e) => point(e.coordinates as Position))
    return (filteredEvents ? bbox(featureCollection([...filteredEvents])) : []) as Bbox
  }

  getVesselEventsLayersLoaded() {
    const eventLayers = this.getEventLayers()
    if (!eventLayers.length) return true
    return eventLayers.every((l) => {
      return l.isLoaded || this.getVesselLayersError(l.props.type)
    })
  }

  getVesselTracksLayersLoaded() {
    if (this.getTrackLayers().length === 0) {
      return true
    }
    return (
      (this.getTrackLayers().length > 0 && this.getTrackLayers().every((l) => l.isLoaded)) ||
      this.getVesselLayersError('track')
    )
  }

  getVesselLayersError(type: `${EventTypes}` | 'track' | 'events') {
    if (!this.state) {
      return false
    }
    if (type === 'events') {
      return Object.entries(this.state.errors).some(([key, value]) => key !== 'track' && value)
    }
    return this.state.errors?.[type] !== undefined
  }

  getAllSublayersLoaded() {
    return this.getVesselEventsLayersLoaded() && this.getVesselTracksLayersLoaded()
  }
}
