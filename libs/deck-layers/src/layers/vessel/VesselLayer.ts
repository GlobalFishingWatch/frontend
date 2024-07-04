import { DataFilterExtension } from '@deck.gl/extensions'
import {
  CompositeLayer,
  Layer,
  LayersList,
  LayerProps,
  Color,
  PickingInfo,
  UpdateParameters,
} from '@deck.gl/core'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { bearingToAzimuth, featureCollection, point } from '@turf/helpers'
import { BBox, Position } from 'geojson'
import { rhumbBearing } from '@turf/turf'
import {
  ApiEvent,
  DataviewCategory,
  DataviewType,
  EventTypes,
  EventVessel,
  TrackSegment,
} from '@globalfishingwatch/api-types'
import {
  VesselDeckLayersEventData,
  VesselEventsLoader,
  VesselTrackLoader,
} from '@globalfishingwatch/deck-loaders'
import { Bbox } from '@globalfishingwatch/data-transforms'
import { THINNING_LEVELS } from '@globalfishingwatch/api-client'
import { PATH_BASENAME } from '../layers.config'
import { deckToHexColor, hexToDeckColor } from '../../utils/colors'
import {
  BLEND_BACKGROUND,
  getFetchLoadOptions,
  getLayerGroupOffset,
  LayerGroup,
  VESSEL_SPRITE_ICON_MAPPING,
} from '../../utils'
import { BaseLayerProps } from '../../types'
import { VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'
import { getEvents, getVesselResourceChunks } from './vessel.utils'
import {
  EVENTS_COLORS,
  EVENT_LAYER_TYPE,
  DEFAULT_FISHING_EVENT_COLOR,
  TRACK_LAYER_TYPE,
  TRACK_DEFAULT_THINNING,
} from './vessel.config'
import {
  VesselDataType,
  VesselDeckLayersEvent,
  VesselEventPickingInfo,
  VesselEventPickingObject,
  VesselEventProperties,
  _VesselLayerProps,
} from './vessel.types'
import { VesselPositionLayer } from './VesselPositionLayer'

export type VesselEventsLayerProps = Omit<_VesselEventsLayerProps, 'type'> & {
  events: VesselDeckLayersEvent[]
}

export type VesselLayerProps = BaseLayerProps &
  _VesselTrackLayerProps &
  VesselEventsLayerProps &
  _VesselLayerProps

let warnLogged = false
export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  initializeState() {
    super.initializeState(this.context)
    this.state = {
      colorDirty: false,
    }
  }

  get isLoaded(): boolean {
    return super.isLoaded && this.getAllSublayersLoaded() && !this.state.colorDirty
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    // TODO:deck try to reemove this workaround because we cannot find
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

  onSublayerError = (error: any) => {
    console.warn(error)
    this.setState({ error })
  }

  _getTracksUrl({
    start,
    end,
    trackUrl,
    zoom,
    trackThinningZoomConfig,
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
    if (trackThinningZoomConfig) {
      const thinningLevel =
        Object.entries(trackThinningZoomConfig)
          .sort(([zoomLevelA], [zoomLevelB]) => parseInt(zoomLevelA) - parseInt(zoomLevelB))
          .findLast(([zoomLevel]) => zoom >= parseInt(zoomLevel))?.[1] || TRACK_DEFAULT_THINNING

      Object.entries(THINNING_LEVELS[thinningLevel]).forEach(([key, value]) => {
        trackUrlObject.searchParams.set(key, value)
      })
    }
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
          data: this._getTracksUrl({ start, end, trackUrl, zoom, trackThinningZoomConfig }),
          loadOptions: {
            ...getFetchLoadOptions(),
          },
          type: TRACK_LAYER_TYPE,
          loaders: [VesselTrackLoader],
          _pathType: 'open',
          widthUnits: 'pixels',
          getWidth: 1,
          widthScale: 1,
          wrapLongitude: true,
          jointRounded: true,
          capRounded: true,
          getColor: color,
          startTime,
          endTime,
          highlightStartTime,
          highlightEndTime,
          minSpeedFilter,
          maxSpeedFilter,
          minElevationFilter,
          maxElevationFilter,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
          onError: this.onSublayerError,
        })
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
            onError: this.onSublayerError,
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
    const { visible, highlightStartTime, highlightEndTime, color } = this.props
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
        })
      ),
    ]
  }

  renderLayers(): Layer<{}> | LayersList {
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
    return this.getSubLayers().filter(
      (l) => !l.id.includes(TRACK_LAYER_TYPE)
    ) as VesselEventsLayer[]
  }

  getVesselName() {
    return this.props.name
  }

  getVesselColor() {
    return deckToHexColor(this.props.color)
  }

  getVesselsData() {
    return this.getSubLayers().map((l) => l.props.data)
  }

  getVesselEventsData(types?: EventTypes[]) {
    return getEvents(this.getEventLayers(), types)
  }

  getVesselTrackData() {
    return this.getTrackLayers()?.flatMap((l) => l.getData())
  }

  getVesselTrackSegments(params = {} as { includeMiddlePoints: boolean }) {
    return this.getTrackLayers()?.flatMap((l) => l.getSegments(params))
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
    return this.getEventLayers().every((l) => l.isLoaded)
  }

  getVesselTracksLayersLoaded() {
    return this.getTrackLayers().every((l) => l.isLoaded)
  }

  getAllSublayersLoaded() {
    return this.getVesselEventsLayersLoaded() && this.getVesselTracksLayersLoaded()
  }

  getErrorMessage() {
    return this.state.error
  }
}
