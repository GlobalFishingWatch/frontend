import type { NumericArray } from '@math.gl/core'
import type { AccessorFunction, ChangeFlags, Color, DefaultProps } from '@deck.gl/core'
import type { PathLayerProps } from '@deck.gl/layers'
import { PathLayer } from '@deck.gl/layers'
import type { TrackSegment } from '@globalfishingwatch/api-types'
import type { VesselTrackData } from '@globalfishingwatch/deck-loaders'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import type { ThinningLevels } from '@globalfishingwatch/api-client'
import { MAX_FILTER_VALUE } from '../layers.config'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from './vessel.config'
import type { GetSegmentsFromDataParams } from './vessel.utils'
import { getSegmentsFromData } from './vessel.utils'

export const COLOR_BY = {
  track: 1,
  speed: 2,
  depth: 3,
}

export type VesselsColorBy = typeof COLOR_BY.track | typeof COLOR_BY.speed | typeof COLOR_BY.depth

/** Properties added by VesselTrackLayer. */
export type _VesselTrackLayerProps<DataT = any> = {
  id: string
  /**
   * The start time of the track in milliseconds
   * @default 0
   */
  startTime: number
  /**
   * The end time of the track in milliseconds
   * @default 0
   */
  endTime: number
  /**
   * The start time to highlight the track in milliseconds
   * @default 0
   */
  highlightStartTime?: number
  /**
   * The end time to highlight the track in milliseconds
   * @default 0
   */
  highlightEndTime?: number
  /**
   * The low speed filter
   * @default 0
   */
  minSpeedFilter?: number
  /**
   * The high speed filter
   * @default 999999999999999
   */
  maxSpeedFilter?: number
  /**
   * The low speed filter
   * @default -999999999999999
   */
  minElevationFilter?: number
  /**
   * The high speed filter
   * @default 999999999999999
   */
  maxElevationFilter?: number
  // /**
  //  * Color to be used as a highlight path
  //  * @default [255, 255, 255, 255]
  //  */
  // getHighlightColor?: Accessor<DataT, Color | Color[]>
  /**
   * Timestamp accessor.
   */
  getTimestamp?: AccessorFunction<DataT, NumericArray>
  getSpeed?: AccessorFunction<DataT, NumericArray>
  getElevation?: AccessorFunction<DataT, NumericArray>
  /**
   * Callback on data changed to update
   */
  onDataChange?: (dataChange: ChangeFlags['dataChanged']) => void
  /**
   * Track API url accessor.
   */
  trackUrl?: string
  /**
   * Track API url accessor.
   */
  colorBy?: VesselsColorBy
  /**
   * Tracks thinning config {[minZoomLevel]: params }
   * e.g. To apply Insane between 0 and 4 zoom levels, and Aggresive for higher
   * { 0: ThinningLevels.Insane, 4: ThinningLevels.Aggressive }
   */
  trackThinningZoomConfig?: Record<number, ThinningLevels>
}

// Example of how to use pass an accesor to the shaders
// not needed anymore as the highlighted color is fixed
// const DEFAULT_HIGHLIGHT_COLOR_RGBA = [255, 255, 255, 255] as Color

const defaultProps: DefaultProps<VesselTrackLayerProps> = {
  _pathType: 'open',
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  highlightStartTime: { type: 'number', value: 0, min: 0 },
  highlightEndTime: { type: 'number', value: 0, min: 0 },
  minSpeedFilter: { type: 'number', value: -MAX_FILTER_VALUE, min: 0 },
  maxSpeedFilter: { type: 'number', value: MAX_FILTER_VALUE, min: 0 },
  minElevationFilter: { type: 'number', value: -MAX_FILTER_VALUE, min: 0 },
  maxElevationFilter: { type: 'number', value: MAX_FILTER_VALUE, min: 0 },
  getPath: { type: 'accessor', value: () => [0, 0] },
  getTimestamp: { type: 'accessor', value: (d) => d },
  getSpeed: { type: 'accessor', value: (d) => d },
  getElevation: { type: 'accessor', value: (d) => d },
  onDataChange: { type: 'function', value: () => {} },
  getColor: { type: 'accessor', value: () => [255, 255, 255, 100] },
  // getHighlightColor: { type: 'accessor', value: DEFAULT_HIGHLIGHT_COLOR_RGBA },
  trackUrl: { type: 'accessor', value: '' },
}

/** All properties supported by VesselTrackLayer. */
export type VesselTrackLayerProps<DataT = any> = _VesselTrackLayerProps<DataT> &
  PathLayerProps<DataT>

/** Render paths that represent vessel trips. */
export class VesselTrackLayer<DataT = any, ExtraProps = Record<string, unknown>> extends PathLayer<
  DataT,
  VesselTrackLayerProps & ExtraProps
> {
  static layerName = 'VesselTrackLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        uniform float highlightStartTime;
        uniform float highlightEndTime;

        in float instanceTimestamps;
        in float instanceSpeeds;
        in float instanceElevations;
        out float vTime;
        out float vSpeed;
        out float vElevation;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `
        vTime = instanceTimestamps;
        vSpeed = instanceSpeeds;
        vElevation = instanceElevations;
        if(vTime > highlightStartTime && vTime < highlightEndTime) {
          gl_Position.z = 1.0;
        }
      `,
      'fs:#decl': `
        uniform float startTime;
        uniform float endTime;
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        uniform float minSpeedFilter;
        uniform float maxSpeedFilter;
        uniform float minElevationFilter;
        uniform float maxElevationFilter;
        uniform vec3 trackColor;
        uniform int colorBy;
        in float vTime;
        in float vSpeed;
        in float vElevation;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': `
        if (vTime < startTime || vTime > endTime) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': `
        if(colorBy == ${COLOR_BY.track}){
          color.r = trackColor.r;
          color.g = trackColor.g;
          color.b = trackColor.b;
        }

        if(colorBy == ${COLOR_BY.speed}){
          // Assign colors based on discrete speed ranges

          // Initialize speedColor
          vec3 speedColor;

          if (vSpeed <= 2.0) {
            speedColor = vec3(0.0, 0.0, 1.0);       // #0000ff
          } else if (vSpeed <= 4.0) {
            speedColor = vec3(0.61, 0.01, 0.84);    // #9d02d7
          } else if (vSpeed <= 6.0) {
            speedColor = vec3(0.80, 0.21, 0.71);    // #cd34b5
          } else if (vSpeed <= 10.0) {
            speedColor = vec3(0.92, 0.37, 0.58);    // #ea5f94
          } else if (vSpeed <= 15.0) {
            speedColor = vec3(0.98, 0.53, 0.45);    // #fa8775
          } else if (vSpeed <= 25.0) {
            speedColor = vec3(1.0, 0.69, 0.31);     // #ffb14e
          } else {
            speedColor = vec3(1.0, 0.84, 0.0);       // #ffd700
          }

          // Assign the computed speedColor to the output variable
          color = vec4(speedColor, 1.0); // Assuming outputColor is the final color variable
        }

        if(colorBy == ${COLOR_BY.depth}){
          // Deep blue (at -5000m) -> Light blue -> White (at 0m)
          float normalizedDepth = clamp(vElevation / 5000.0, 0.0, 1.0);

          color.b = normalizedDepth; // 0 to 1 (dark to white)
          color.g = normalizedDepth; // 0 to 1 (dark to white)
          color.r = mix(0.5, 1.0, normalizedDepth); // 0.5 to 1 (deep blue to white)
        }

        if (vSpeed < minSpeedFilter ||
            vSpeed > maxSpeedFilter ||
            vElevation < minElevationFilter ||
            vElevation > maxElevationFilter)
        {
          color.a = 0.25;
        }

        if (vTime > highlightStartTime && vTime < highlightEndTime) {
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
      attributeManager.addInstanced({
        speeds: {
          size: 1,
          accessor: 'getSpeed',
          shaderAttributes: {
            instanceSpeeds: {},
          },
        },
      })
      attributeManager.addInstanced({
        elevations: {
          size: 1,
          accessor: 'getElevation',
          shaderAttributes: {
            instanceElevations: {},
          },
        },
      })
    }
  }

  // updateState(params: UpdateParameters<any>) {
  //   super.updateState(params)
  //   const { dataChanged } = params.changeFlags
  //   if (dataChanged !== false && this.props.onDataChange) {
  //     this.props.onDataChange(dataChanged)
  //   }
  // }

  draw(params: any) {
    const {
      startTime,
      endTime,
      highlightStartTime = 0,
      highlightEndTime = 0,
      getColor,
      minSpeedFilter = -MAX_FILTER_VALUE,
      maxSpeedFilter = MAX_FILTER_VALUE,
      minElevationFilter = -MAX_FILTER_VALUE,
      maxElevationFilter = MAX_FILTER_VALUE,
      colorBy,
    } = this.props

    const trackColor = getColor as Color
    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
      highlightStartTime,
      highlightEndTime,
      minSpeedFilter,
      maxSpeedFilter,
      minElevationFilter,
      maxElevationFilter,
      trackColor: [trackColor[0] / 255, trackColor[1] / 255, trackColor[2] / 255],
      colorBy: colorBy || COLOR_BY.track,
    }
    super.draw(params)
  }

  getData(): VesselTrackData {
    return this.props.data as VesselTrackData
  }

  getSegments(param = {} as GetSegmentsFromDataParams): TrackSegment[] {
    return getSegmentsFromData(this.props.data as VesselTrackData, param)
  }

  getBbox() {
    const data = this.props.data as VesselTrackData
    const positions = data.attributes?.getPath?.value
    const positionsSize = data.attributes?.getPath?.size
    const timestamps = data.attributes?.getTimestamp?.value
    if (!timestamps?.length) return null

    const firstPointIndex = timestamps.findIndex((t) => t > this.props.startTime)
    const lastPointIndex = timestamps.findLastIndex((t) => t < this.props.endTime)
    if (firstPointIndex === -1 || lastPointIndex === -1) return null

    const bounds = [Infinity, Infinity, -Infinity, -Infinity] as Bbox
    for (let index = firstPointIndex; index <= lastPointIndex; index++) {
      const longitude = positions[index * positionsSize]
      const latitude = positions[index * positionsSize + 1]
      if (longitude < bounds[0]) bounds[0] = longitude
      if (longitude > bounds[2]) bounds[2] = longitude
      if (latitude < bounds[1]) bounds[1] = latitude
      if (latitude > bounds[3]) bounds[3] = latitude
    }
    return wrapBBoxLongitudes(bounds)
  }
}
