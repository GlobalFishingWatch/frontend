import type { Layer, LayerDataSource, LayerProps, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { distance, rhumbBearing } from '@turf/turf'
import type { Position } from 'geojson'

import { DataviewType, type TrackSegment } from '@globalfishingwatch/api-types'
import { COLOR_TRANSPARENT, type GetSegmentsFromDataParams } from '@globalfishingwatch/deck-layers'

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

  getPickingInfo(params: { info: PickingInfo<VesselTrackPickingObject> }) {
    const { info } = params
    const object = {
      ...(info.object || ({} as VesselTrackProperties)),
      subcategory: DataviewType.Track,
    }

    const trackLayer = info.sourceLayer as VesselTrackLayer
    const trackData = trackLayer.getData()
    if (trackData?.length) {
      const segments = trackLayer.getSegments({
        includeMiddlePoints: true,
        includeCoordinates: true,
      })
      if (segments?.length) {
        // Find the closest point to the hover coordinate
        let closestSegmentIndex
        let closestPointIndex
        let minDistance = Number.MAX_VALUE

        segments.forEach((points, index) => {
          for (let i = 0; i < points.length - 1; i++) {
            const point = points[i]
            const pointDistance = distance(info.coordinate as Position, [
              point.longitude!,
              point.latitude!,
            ])
            if (pointDistance < minDistance) {
              minDistance = pointDistance
              closestSegmentIndex = index
              closestPointIndex = i
            }
          }
        })
        if (closestSegmentIndex !== undefined && closestPointIndex !== undefined) {
          const closestPoint = segments[closestSegmentIndex][closestPointIndex]
          if (closestPoint) {
            object.timestamp = closestPoint.timestamp || undefined
            object.speed = closestPoint?.speed || undefined
            object.depth = closestPoint?.elevation || undefined
            const nextPoint = segments[closestSegmentIndex][closestPointIndex + 1]
            const pointBearing = rhumbBearing(
              [closestPoint.longitude, closestPoint.latitude] as Position,
              [nextPoint.longitude, nextPoint.latitude] as Position
            )
            object.course = pointBearing
          }
        }
      }
    }

    return { ...info, object }
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { id, data, ...props } = this.props

    // Create a transparent thicker layer for better interactivity
    const interactiveLayer = new VesselTrackLayer<TrackSegment[], { type: VesselDataType }>({
      ...props,
      id: `${id}-interactive`,
      data: data as LayerDataSource<TrackSegment[]>,
      getWidth: 10,
      getColor: COLOR_TRANSPARENT,
      pickable: true,
      highlightStartTime: undefined,
      highlightEndTime: undefined,
      highlightEventStartTime: undefined,
      highlightEventEndTime: undefined,
      colorBy: undefined,
    })

    // Create the normal track layer
    const trackLayer = new VesselTrackLayer<TrackSegment[], { type: VesselDataType }>({
      ...props,
      id: `${id}-track`,
      data: data as LayerDataSource<TrackSegment[]>,
      getWidth: 1.5,
    })

    return [interactiveLayer, trackLayer]
  }

  getData() {
    const interactiveLayer = this.getSubLayers()[0] as VesselTrackLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer.getData()
  }

  getSegments(params: GetSegmentsFromDataParams) {
    const interactiveLayer = this.getSubLayers()[0] as VesselTrackLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer.getSegments(params)
  }

  getGraphExtent(graph: 'speed' | 'elevation') {
    const interactiveLayer = this.getSubLayers()[0] as VesselTrackLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer.getGraphExtent(graph)
  }

  getBbox(params: { startDate?: number | string; endDate?: number | string }) {
    const interactiveLayer = this.getSubLayers()[0] as VesselTrackLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return interactiveLayer.getBbox(params)
  }
}
