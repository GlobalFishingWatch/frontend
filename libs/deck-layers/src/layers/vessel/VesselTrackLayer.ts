import type { NumericArray } from '@math.gl/core'
import { AccessorFunction, DefaultProps, UpdateParameters } from '@deck.gl/core'
import { PathLayer, PathLayerProps } from '@deck.gl/layers'
import { TrackSegment } from '@globalfishingwatch/api-types'
import { VesselTrackData } from '@globalfishingwatch/deck-loaders'
import { TRACK_LAYER_TYPE } from './VesselLayer'

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
  // /**
  //  * Color to be used as a highlight path
  //  * @default [255, 255, 255, 255]
  //  */
  // getHighlightColor?: Accessor<DataT, Color | Color[]>
  /**
   * Timestamp accessor.
   */
  getTimestamps?: AccessorFunction<DataT, NumericArray>
  /**
   * Callback on data changed to update
   */
  onDataChange?: (type: typeof TRACK_LAYER_TYPE, dataChange: string) => void
  /**
   * Track API url accessor.
   */
  trackUrl?: string
}

// Example of how to use pass an accesor to the shaders
// not needed anymore as the highlighted color is fixed
// const DEFAULT_HIGHLIGHT_COLOR_RGBA = [255, 255, 255, 255] as Color

const DEFAULT_HIGHLIGHT_COLOR_VEC = [1.0, 1.0, 1.0, 1.0]
const defaultProps: DefaultProps<VesselTrackLayerProps> = {
  _pathType: 'open',
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  highlightStartTime: { type: 'number', value: 0, min: 0 },
  highlightEndTime: { type: 'number', value: 0, min: 0 },
  getPath: { type: 'accessor', value: () => [0, 0] },
  getTimestamps: { type: 'accessor', value: (d) => d },
  onDataChange: { type: 'function', value: () => {} },
  getColor: { type: 'accessor', value: () => [255, 255, 255, 100] },
  // getHighlightColor: { type: 'accessor', value: DEFAULT_HIGHLIGHT_COLOR_RGBA },
  trackUrl: { type: 'accessor', value: '' },
}

/** All properties supported by VesselTrackLayer. */
export type VesselTrackLayerProps<DataT = any> = _VesselTrackLayerProps<DataT> &
  PathLayerProps<DataT>

/** Render paths that represent vessel trips. */
export class VesselTrackLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  VesselTrackLayerProps & ExtraProps
> {
  static layerName = 'VesselTrackLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        in float instanceTimestamps;
        // in vec4 instanceHighlightColor;
        out float vTime;
        // out vec4 vHighlightColor;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `
        vTime = instanceTimestamps;
        // vHighlightColor = vec4(instanceHighlightColor.rgb, instanceHighlightColor.a);
      `,
      'fs:#decl': `
        uniform float startTime;
        uniform float endTime;
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        // in vec4 vHighlightColor;
        in float vTime;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': `
        if(vTime < startTime || vTime > endTime) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': `
        if (vTime < highlightStartTime || vTime > highlightEndTime) {
          color = color;
        } else {
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
          accessor: 'getTimestamps',
          shaderAttributes: {
            instanceTimestamps: {},
          },
        },
      })
    }
  }

  updateState(params: UpdateParameters<any>) {
    super.updateState(params)
    const { dataChanged } = params.changeFlags
    if (dataChanged !== false && this.props.onDataChange) {
      this.props.onDataChange(params.props.type, dataChanged as string)
    }
  }

  draw(params: any) {
    const { startTime, endTime, highlightStartTime, highlightEndTime, highlightColor } = this.props

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
      highlightStartTime: highlightStartTime ? highlightStartTime : 0,
      highlightEndTime: highlightEndTime ? highlightEndTime : 0,
      highlightColor,
    }
    super.draw(params)
  }

  getData(): VesselTrackData {
    return this.props.data as VesselTrackData
  }

  getSegments(): TrackSegment[] {
    const data = this.props.data as VesselTrackData
    const segmentsIndex = data.startIndices
    const positions = data.attributes?.positions!?.value
    const timestamps = data.attributes?.getTimestamps?.value
    if (!positions?.length || !timestamps.length) {
      return []
    }
    const size = data.attributes.positions!?.size
    const segments = segmentsIndex.map((segment, i, segments) => {
      const initialPoint = {
        longitude: positions[segment],
        latitude: positions[segment + 1],
        timestamp: timestamps[segment / size],
      }
      const nextSegmentIndex = segments[i + 1]
      const lastPoint =
        i === segmentsIndex.length - 1
          ? {
              longitude: positions[positions.length - size],
              latitude: positions[positions.length - size + 1],
              timestamp: timestamps[timestamps.length - 1],
            }
          : {
              longitude: positions[nextSegmentIndex],
              latitude: positions[nextSegmentIndex + 1],
              timestamp: timestamps[nextSegmentIndex / size - 1],
            }
      return [initialPoint, lastPoint]
    })
    return segments
  }
}
