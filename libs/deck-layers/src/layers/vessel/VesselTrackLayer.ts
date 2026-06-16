import type { Layer, LayerProps, LayersList, PickingInfo, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { rhumbBearing } from '@turf/turf'
import type { Position } from 'geojson'
import { around } from 'geokdbush'
import KDBush from 'kdbush'

import { DataviewType, type TrackPoint, type TrackSegment } from '@globalfishingwatch/api-types'
import type { VesselTrackData } from '@globalfishingwatch/deck-loaders'

import { COLOR_TRANSPARENT, getLayerGroupOffset, LayerGroup } from '../../utils'

import type {
  VesselDataType,
  VesselTrackPickingObject,
  VesselTrackProperties,
  VesselTrackVisualizationMode,
} from './vessel.types'
import { getSegmentsFromData, type GetSegmentsFromDataParams } from './vessel.utils'
import type { VesselTrackPositionFeature } from './VesselPositionLayer'
import { VesselTrackPositionLayer } from './VesselPositionLayer'
import type { _VesselTrackPathLayerProps } from './VesselTrackPathLayer'
import { getTrackShaderLayoutKey, VesselTrackPathLayer } from './VesselTrackPathLayer'

export type VesselTrackLayerProps = Omit<_VesselTrackPathLayerProps, 'hoveredTime'> &
  LayerProps & {
    visualizationMode?: VesselTrackVisualizationMode
    hoveredTime?: number
  }

export class VesselTrackLayer extends CompositeLayer<VesselTrackLayerProps> {
  static layerName = 'VesselTrackLayer'
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
      let closestPoint: TrackPoint | undefined
      let nextPoint: TrackPoint | undefined
      if (info.sourceLayer instanceof VesselTrackPositionLayer) {
        closestPoint = this.state.points[info.index + 1]
        nextPoint = this.state.points[info.index + 2]
        object.interactionType = 'point'
      } else {
        const nearestIds = around(
          this.state.pointIndex,
          info.coordinate[0]!,
          info.coordinate[1]!,
          1
        ) as number[]
        closestPoint = this.state.points[nearestIds[0]]
        nextPoint = this.state.points[nearestIds[0] + 1]
      }
      if (closestPoint) {
        object.timestamp = closestPoint.timestamp || undefined
        if (nextPoint) {
          const pointBearing =
            (info.object?.properties as any)?.course ||
            rhumbBearing(
              [closestPoint.longitude, closestPoint.latitude] as Position,
              [nextPoint.longitude, nextPoint.latitude] as Position
            )
          object.course = pointBearing
        }
      }
    }
    return { ...info, object }
  }

  updateState = ({ changeFlags, oldProps }: UpdateParameters<Layer<VesselTrackLayerProps>>) => {
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
        gapSegmentThreshold: this.props.gapSegmentThreshold,
      })
      if (segments?.length) {
        // getSegments already splits the track at gaps, so compute the course per segment:
        // it resets at every gap boundary and never bridges a hidden gap.
        const pointsWithCourse = segments.flatMap((segment) => {
          if (!segment.length) return []
          return segment.flatMap((point, index) => {
            if (index < segment.length - 1) {
              const nextPoint = segment[index + 1]
              if (
                nextPoint.latitude === point.latitude &&
                nextPoint.longitude === point.longitude
              ) {
                return []
              }
              if (
                point.longitude &&
                point.latitude &&
                nextPoint?.longitude &&
                nextPoint?.latitude
              ) {
                try {
                  const course = rhumbBearing(
                    [point.longitude, point.latitude] as Position,
                    [nextPoint.longitude, nextPoint.latitude] as Position
                  )
                  return { ...point, course }
                } catch {
                  return []
                }
              }
              return []
            }
            return { ...point, course: 0 }
          })
        })
        if (pointsWithCourse.length) {
          this.setState({
            points: pointsWithCourse,
            pointIndex: new KDBush(pointsWithCourse.length),
          })
          pointsWithCourse.forEach(({ longitude, latitude }) => {
            this.state.pointIndex.add(longitude!, latitude!)
          })
          this.state.pointIndex.finish()
        }
      }
    }
  }

  renderLayers(): Layer<VesselTrackData> | LayersList {
    const { id, data, visualizationMode = 'track', ...props } = this.props

    const interactiveLayoutKey = getTrackShaderLayoutKey({
      ...props,
      colorBy: undefined,
      gapSegmentThreshold: undefined,
    })

    const trackLayers = [
      ...(visualizationMode !== 'positions'
        ? [
            // Transparent thicker layer for interactivity
            new VesselTrackPathLayer<VesselTrackData, { type: VesselDataType }>({
              ...props,
              id: `${id}-${interactiveLayoutKey}-interactive`,
              data: data as VesselTrackData,
              getWidth: 10,
              getColor: COLOR_TRANSPARENT,
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Background, params),
              pickable: true,
              highlightStartTime: undefined,
              highlightEndTime: undefined,
              highlightEventStartTime: undefined,
              highlightEventEndTime: undefined,
              hoveredTime: undefined,
              colorBy: undefined,
              gapSegmentThreshold: undefined,
            }),
          ]
        : []),
      new VesselTrackPathLayer<VesselTrackData, { type: VesselDataType }>({
        ...props,
        id: `${id}-${getTrackShaderLayoutKey(props)}-track`,
        data: data as VesselTrackData,
        getWidth: 1.5,
        pickable: false,
        hoveredTime: props.hoveredTime,
      }),
    ] as LayersList

    if (visualizationMode === 'positions' && this.state.points?.length) {
      const pointsLength = this.state.points.length
      const positions = this.state.points.flatMap((point, index) => {
        if (
          !point.timestamp ||
          point.timestamp <= this.props.startTime ||
          point.timestamp >= this.props.endTime ||
          index === pointsLength - 1
        ) {
          return []
        }
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.longitude, point.latitude] as Position,
          },
          properties: {
            course: point.course,
            timestamp: point.timestamp,
          },
        } as VesselTrackPositionFeature
      })
      trackLayers.push(
        new VesselTrackPositionLayer({
          ...props,
          pickable: true,
          id: `${id}-positions`,
          data: positions,
          iconBorder: false,
        })
      )
    }

    return trackLayers
  }

  getData() {
    return this.props.data as VesselTrackData
  }

  getSegments(params = {} as GetSegmentsFromDataParams) {
    return getSegmentsFromData(this.props.data as VesselTrackData, {
      gapSegmentThreshold: this.props.gapSegmentThreshold,
      ...params,
    })
  }

  getGraphExtent(graph: 'speed' | 'elevation') {
    const interactiveLayer = this.getSubLayers()?.[0] as VesselTrackPathLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer?.getGraphExtent(graph)
  }

  getBbox(params: { startDate?: number | string; endDate?: number | string }) {
    const interactiveLayer = this.getSubLayers()?.[0] as VesselTrackPathLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer?.getBbox(params)
  }
}
