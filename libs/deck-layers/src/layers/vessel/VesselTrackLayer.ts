import type { Layer, LayerProps, LayersList, PickingInfo, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { TileLayer } from '@deck.gl/geo-layers'
import { BitmapLayer } from '@deck.gl/layers'
import { rhumbBearing } from '@turf/turf'
import type { Position } from 'geojson'
import { around } from 'geokdbush'
import KDBush from 'kdbush'

import { DataviewType, type TrackPoint, type TrackSegment } from '@globalfishingwatch/api-types'
import type { VesselTrackData } from '@globalfishingwatch/deck-loaders'

import { TRACK_VISIBLE_WIDTH } from '#config/layers.config'

import { getPositions } from './vessel.track.utils'
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

// ---- TEMP experiment, do not commit ----
// Simulates an API that serves the track as raster tiles (/{z}/{x}/{y}.png) instead of points.
// Here the tiles are drawn in the browser from the full track; a real version renders them server-side.
const TRACK_AS_BITMAP = true
const BITMAP_MAX_ZOOM = 8 // tiles stop at this zoom; past it they are upscaled (z8 pixel ≈ 600 m at the equator)
const BITMAP_TILE_SIZE = 256
const BITMAP_LINE_WIDTH_PX = 1.7
const BITMAP_PIXEL_RATIO = 2 // @2x: tile images are 512 px for 256 px of map

const lngToTileX = (lng: number, z: number) => ((lng + 180) / 360) * 2 ** z
const latToTileY = (lat: number, z: number) => {
  const rad = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z
}

const HIGHLIGHT_SNAP_MS = 24 * 3_600_000 // highlight windows + hover time snap to whole UTC days (limits time-window scraping)
const HIGHLIGHT_EVENT_WIDTH_RATIO = 3 // event highlight is drawn thicker, like the vector track
const POSITION_GRID_DEG = 360 / (BITMAP_TILE_SIZE * BITMAP_PIXEL_RATIO * 2 ** BITMAP_MAX_ZOOM) // = 1 tile pixel
const POSITION_COURSE_STEP = 360 / 18 // 18 directions

// Vessel icon gets a coarse point: snapped to the centre of a tile-pixel-sized cell, course to 20° steps.
// ponytail: lat uses the lon cell size, so cells are a bit taller than a mercator pixel away from the equator
export function coarsenPositionFeature<
  F extends { geometry: { coordinates: number[] }; properties?: any },
>(f: F): F {
  const snap = (v: number) =>
    Math.floor(v / POSITION_GRID_DEG) * POSITION_GRID_DEG + POSITION_GRID_DEG / 2
  const [lon, lat] = f.geometry.coordinates
  const course = f.properties?.course
  return {
    ...f,
    geometry: { ...f.geometry, coordinates: [snap(lon), snap(lat)] },
    properties: {
      ...f.properties,
      ...(typeof course === 'number' && {
        course: (Math.round(course / POSITION_COURSE_STEP) * POSITION_COURSE_STEP + 360) % 360,
      }),
    },
  }
}

const BITMAP_PICK_RADIUS_PX = 4 // hover tolerance around the drawn line, in screen px

// Bitmap that only picks where the line was drawn: fragments whose neighbourhood is fully transparent
// are discarded, so empty tile areas don't swallow hovers meant for layers underneath.
class TrackBitmapLayer extends BitmapLayer {
  static layerName = 'TrackBitmapLayer'
  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      ...(shaders.inject || {}),
      // #main-end: inside main(), where bitmapTexture and the local uv exist
      // (DECKGL_FILTER_COLOR is emitted above the sampler declaration)
      'fs:#main-end': /*glsl*/ `
        {
          vec2 texel = 1.0 / vec2(textureSize(bitmapTexture, 0));
          float a = texture(bitmapTexture, uv).a;
          if (picking.isActive > 0.5) {
            for (int dx = -1; dx <= 1; dx++) {
              for (int dy = -1; dy <= 1; dy++) {
                a = max(a, texture(bitmapTexture, uv + vec2(dx, dy) * texel * ${(BITMAP_PICK_RADIUS_PX * BITMAP_PIXEL_RATIO).toFixed(1)}).a);
              }
            }
          }
          if (a < 0.05) discard;
        }
      `,
    }
    return shaders
  }
}

// Simulates `GET /tracks/coarse-point?lon&lat` on the API: the nearest point, returned coarse.
// ponytail: answered in the browser from the full track; the real one is a server request (debounce it)
function toCoarseHover<T extends { timestamp?: number; course?: number }>(object: T): T {
  return {
    ...object,
    ...(object.timestamp && {
      timestamp: Math.floor(object.timestamp / HIGHLIGHT_SNAP_MS) * HIGHLIGHT_SNAP_MS,
    }),
    ...(typeof object.course === 'number' && {
      course: (Math.round(object.course / POSITION_COURSE_STEP) * POSITION_COURSE_STEP + 360) % 360,
    }),
  }
}

type TilePass = { segments: TrackSegment[]; color: number[]; width: number }

function drawTrackTile(passes: TilePass[], { x, y, z }: { x: number; y: number; z: number }) {
  const res = BITMAP_TILE_SIZE * BITMAP_PIXEL_RATIO
  const canvas = new OffscreenCanvas(res, res)
  const ctx = canvas.getContext('2d')!
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  let drawn = false
  for (const { segments, color, width } of passes) {
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${(color[3] ?? 255) / 255})`
    ctx.lineWidth = width * BITMAP_PIXEL_RATIO
    for (const segment of segments) {
      ctx.beginPath()
      let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity]
      segment.forEach((point, i) => {
        const px = (lngToTileX(point.longitude!, z) - x) * res
        const py = (latToTileY(point.latitude!, z) - y) * res
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
        minX = Math.min(minX, px)
        maxX = Math.max(maxX, px)
        minY = Math.min(minY, py)
        maxY = Math.max(maxY, py)
      })
      ctx.stroke()
      // segment bbox overlaps the tile (ponytail: bbox test, may keep a few blank tiles)
      if (maxX >= 0 && minX <= res && maxY >= 0 && minY <= res) drawn = true
    }
  }
  return drawn ? canvas.transferToImageBitmap() : null
}
// ---- end TEMP ----

export class VesselTrackLayer extends CompositeLayer<VesselTrackLayerProps> {
  static layerName = 'VesselTrackLayer'
  state: {
    points: TrackPoint[]
    pointIndex: KDBush
    positions: VesselTrackPositionFeature[]
  } = {
    points: [],
    pointIndex: new KDBush(0),
    positions: [],
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
        const pointIndex = (info.object?.properties as { pointIndex?: number })?.pointIndex
        closestPoint = pointIndex !== undefined ? this.state.points[pointIndex] : undefined
        nextPoint = pointIndex !== undefined ? this.state.points[pointIndex + 1] : undefined
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
    // TEMP experiment: a bitmap hit only gets the coarse point back
    if (info.sourceLayer instanceof TrackBitmapLayer)
      return { ...info, object: toCoarseHover(object) }
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
            positions: getPositions(pointsWithCourse, {
              startTime: this.props.startTime,
              endTime: this.props.endTime,
            }),
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

    if (TRACK_AS_BITMAP) {
      const getColor = (props as { getColor?: unknown }).getColor
      const color = (Array.isArray(getColor) ? getColor : [255, 255, 255]) as number[]
      const white = [255, 255, 255]
      const segmentsIn = (startTime: number, endTime: number) =>
        this.getSegments({
          includeMiddlePoints: true,
          includeCoordinates: true,
          startTime,
          endTime,
        })
      const snapWindow = (start?: number, end?: number) =>
        start && end
          ? ([
              Math.floor(start / HIGHLIGHT_SNAP_MS) * HIGHLIGHT_SNAP_MS,
              Math.ceil(end / HIGHLIGHT_SNAP_MS) * HIGHLIGHT_SNAP_MS,
            ] as const)
          : undefined
      // Each tile layer = one "API request" kind: the base track, and the highlight overlay.
      const highlight = snapWindow(this.props.highlightStartTime, this.props.highlightEndTime)
      const highlightEvent = snapWindow(
        this.props.highlightEventStartTime,
        this.props.highlightEventEndTime
      )
      const layers: LayersList = [
        this.getBitmapTileLayer(
          'bitmap',
          [data, this.props.startTime, this.props.endTime, color.join()],
          () => [
            {
              segments: segmentsIn(this.props.startTime, this.props.endTime),
              color,
              width: BITMAP_LINE_WIDTH_PX,
            },
          ],
          true
        ),
      ]
      if (highlight || highlightEvent) {
        layers.push(
          this.getBitmapTileLayer(
            'bitmap-highlight',
            [data, highlight?.join(), highlightEvent?.join()],
            () => [
              ...(highlight
                ? [
                    {
                      segments: segmentsIn(...highlight),
                      color: white,
                      width: BITMAP_LINE_WIDTH_PX,
                    },
                  ]
                : []),
              ...(highlightEvent
                ? [
                    {
                      segments: segmentsIn(...highlightEvent),
                      color: white,
                      width: BITMAP_LINE_WIDTH_PX * HIGHLIGHT_EVENT_WIDTH_RATIO,
                    },
                  ]
                : []),
            ]
          )
        )
      }
      return layers
    }

    const trackLayers = [
      new VesselTrackPathLayer<VesselTrackData, { type: VesselDataType }>({
        ...props,
        id: `${id}-${getTrackShaderLayoutKey(props)}-track`,
        data: data as VesselTrackData,
        getWidth: TRACK_VISIBLE_WIDTH,
        pickable: visualizationMode !== 'positions' && visualizationMode !== 'points',
        hoveredTime: props.hoveredTime,
      }),
    ] as LayersList

    if (
      (visualizationMode === 'positions' || visualizationMode === 'points') &&
      this.state.points?.length
    ) {
      trackLayers.push(
        new VesselTrackPositionLayer({
          ...props,
          pickable: true,
          id: `${id}-positions`,
          data: this.state.positions,
          iconBorder: false,
          positionMode: visualizationMode === 'points' ? 'point' : 'icon',
          showLabel: !!props.highlightStartTime,
        })
      )
    }

    return trackLayers
  }

  // TEMP experiment: one raster tile layer drawn from the given passes
  getBitmapTileLayer(
    suffix: string,
    triggers: unknown[],
    getPasses: () => TilePass[],
    pickable = false
  ) {
    return new TileLayer<ImageBitmap | null>({
      id: `${this.props.id}-${suffix}`,
      pickable,
      maxZoom: BITMAP_MAX_ZOOM,
      tileSize: BITMAP_TILE_SIZE,
      getTileData: ({ index }) => drawTrackTile(getPasses(), index),
      updateTriggers: { getTileData: triggers },
      renderSubLayers: (sub) => {
        const { west, south, east, north } = sub.tile.bbox as {
          west: number
          south: number
          east: number
          north: number
        }
        return sub.data
          ? new TrackBitmapLayer({
              id: sub.id,
              pickable,
              image: sub.data,
              bounds: [west, south, east, north],
              // same depth group as the vector track, otherwise bathymetry/basemap layers cover it
              getPolygonOffset: this.props.getPolygonOffset,
            })
          : null
      },
    })
  }

  getData() {
    return this.props.data as VesselTrackData
  }

  getSegments(params = {} as GetSegmentsFromDataParams) {
    return getSegmentsFromData(this.getData(), {
      gapSegmentThreshold: this.props.gapSegmentThreshold,
      ...params,
    })
  }

  getGraphExtent(graph: 'speed' | 'elevation') {
    const trackLayer = this.getSubLayers()?.[0] as VesselTrackPathLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return trackLayer?.getGraphExtent(graph)
  }

  getBbox(params: { startDate?: number | string; endDate?: number | string }) {
    const trackLayer = this.getSubLayers()?.[0] as VesselTrackPathLayer<
      TrackSegment[],
      { type: VesselDataType }
    >
    return trackLayer?.getBbox(params)
  }
}
