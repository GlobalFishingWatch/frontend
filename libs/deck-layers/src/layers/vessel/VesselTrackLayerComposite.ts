import type { Layer, LayerProps, LayersList, PickingInfo, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { rhumbBearing } from '@turf/turf'
import type { Position } from 'geojson'
import * as geokdbush from 'geokdbush'
import KDBush from 'kdbush'

import { DataviewType, type TrackPoint, type TrackSegment } from '@globalfishingwatch/api-types'
import {
  COLOR_TRANSPARENT,
  getSegmentsFromData,
  type GetSegmentsFromDataParams,
} from '@globalfishingwatch/deck-layers'
import type { VesselTrackData } from '@globalfishingwatch/deck-loaders'

import type {
  VesselDataType,
  VesselTrackPickingObject,
  VesselTrackProperties,
} from './vessel.types'
import type { _VesselTrackLayerProps } from './VesselTrackLayer'
import { VesselTrackLayer } from './VesselTrackLayer'

export type VesselTrackLayerCompositeProps = _VesselTrackLayerProps & LayerProps

export class VesselTrackLayerComposite extends CompositeLayer<VesselTrackLayerCompositeProps> {
  static layerName = 'VesselTrackLayerComposite'
  state: {
    points: TrackPoint[]
    pointIndex: KDBush
  } = {
    points: [],
    pointIndex: new KDBush(0),
  }

  getPickingInfo = (params: { info: PickingInfo<VesselTrackPickingObject> }) => {
    const { info } = params
    const object = {
      ...(info.object || ({} as VesselTrackProperties)),
      subcategory: DataviewType.Track,
    }
    if (this.state.points?.length && info.coordinate) {
      const nearestIds = geokdbush.around(
        this.state.pointIndex,
        info.coordinate[0]!,
        info.coordinate[1]!,
        1
      ) as number[]
      const closestPoint = this.state.points[nearestIds[0]]
      if (closestPoint) {
        object.timestamp = closestPoint.timestamp || undefined
        object.speed = closestPoint.speed || undefined
        object.depth = closestPoint.elevation || undefined
        const nextPoint = this.state.points[nearestIds[0] + 1]
        if (nextPoint) {
          const pointBearing = rhumbBearing(
            [closestPoint.longitude, closestPoint.latitude] as Position,
            [nextPoint.longitude, nextPoint.latitude] as Position
          )
          object.course = pointBearing
        }
      }
    }
    return { ...info, object }
  }

  updateState = ({
    changeFlags,
    oldProps,
  }: UpdateParameters<Layer<VesselTrackLayerCompositeProps>>) => {
    if (
      changeFlags.dataChanged ||
      oldProps.startTime !== this.props.startTime ||
      oldProps.endTime !== this.props.endTime
    ) {
      const segments = this.getSegments({
        includeMiddlePoints: true,
        includeCoordinates: true,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
      })
      if (segments?.length) {
        const points = segments.flatMap((segment) => (segment.length ? segment : []))
        if (points.length) {
          this.setState({
            points,
            pointIndex: new KDBush(points.length),
          })
          points.forEach(({ longitude, latitude }) => {
            this.state.pointIndex.add(longitude!, latitude!)
          })
          this.state.pointIndex.finish()
        }
      }
    }
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { id, data, ...props } = this.props

    // Transparent thicker layer for interactivity
    const interactiveLayer = new VesselTrackLayer<TrackSegment[], { type: VesselDataType }>({
      ...props,
      id: `${id}-interactive`,
      data: data as TrackSegment[],
      getWidth: 10,
      getColor: COLOR_TRANSPARENT,
      pickable: true,
      highlightStartTime: undefined,
      highlightEndTime: undefined,
      highlightEventStartTime: undefined,
      highlightEventEndTime: undefined,
      hoveredTime: undefined,
      colorBy: undefined,
    })

    // Visisble track layer
    const trackLayer = new VesselTrackLayer<TrackSegment[], { type: VesselDataType }>({
      ...props,
      id: `${id}-track`,
      data: data as TrackSegment[],
      getWidth: 1.5,
    })

    return [interactiveLayer, trackLayer] as LayersList
  }

  getData() {
    return this.props.data as VesselTrackData
  }

  getSegments(params: GetSegmentsFromDataParams) {
    return getSegmentsFromData(this.props.data as VesselTrackData, params)
  }

  getGraphExtent(graph: 'speed' | 'elevation') {
    const interactiveLayer = this.getSubLayers()?.[0] as VesselTrackLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer?.getGraphExtent(graph)
  }

  getBbox(params: { startDate?: number | string; endDate?: number | string }) {
    const interactiveLayer = this.getSubLayers()?.[0] as VesselTrackLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer?.getBbox(params)
  }
}
