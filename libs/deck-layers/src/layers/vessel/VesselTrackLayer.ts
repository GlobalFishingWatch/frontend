import type { NumericArray } from '@math.gl/core'
import { AccessorFunction, DefaultProps } from '@deck.gl/core/typed'
import { PathLayer, PathLayerProps } from '@deck.gl/layers/typed'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'
import { Point, Segment } from '@globalfishingwatch/api-types'
import { VesselTrackData } from '../../loaders/vessels/trackLoader'

/** Properties added by VesselTrackLayer. */
export type _VesselTrackLayerProps<DataT = any> = {
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
   * Ordering index on the layers stack
   */
  zIndex?: number
  /**
   * Timestamp accessor.
   */
  getTimestamps?: AccessorFunction<DataT, NumericArray>
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
  getColor: { type: 'accessor', value: () => [255, 255, 255, 100] },
  // getHighlightColor: { type: 'accessor', value: DEFAULT_HIGHLIGHT_COLOR_RGBA },
  trackUrl: { type: 'accessor', value: '' },
  zIndex: { type: 'accessor', value: GROUP_ORDER.indexOf(Group.Point) },
}

/** All properties supported by VesselTrackLayer. */
export type VesselTrackLayerProps<DataT = any> = _VesselTrackLayerProps<DataT> &
  PathLayerProps<DataT>

/** Render paths that represent vessel trips. */
export class VesselTrackLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  Required<VesselTrackLayerProps> & ExtraProps
> {
  static layerName = 'VesselTrackLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        attribute float instanceTimestamps;
        // attribute vec4 instanceHighlightColor;
        varying float vTime;
        // varying vec4 vHighlightColor;
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
        // varying vec4 vHighlightColor;
        varying float vTime;
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
      // attributeManager.addInstanced({
      //   instanceHighlightColor: {
      //     size: this.props.colorFormat.length,
      //     type: GL.UNSIGNED_BYTE,
      //     normalized: true,
      //     accessor: 'getHighlightColor',
      //     defaultValue: DEFAULT_HIGHLIGHT_COLOR_RGBA as number[],
      //   },
      // })
    }
  }

  draw(params: any) {
    const { startTime, endTime, highlightStartTime, highlightEndTime } = this.props
    params.uniforms = {
      ...params.uniforms,
      startTime: startTime / 1000,
      endTime: endTime / 1000,
      highlightStartTime: highlightStartTime ? highlightStartTime / 1000 : 0,
      highlightEndTime: highlightEndTime ? highlightEndTime / 1000 : 0,
    }
    super.draw(params)
  }

  getSegments(): Segment[] {
    const data = this.props.data as VesselTrackData
    const segmentsIndex = data.startIndices
    const positions = data.attributes?.positions!?.value
    const timestamps = data.attributes?.getTimestamps?.value
    if (!positions?.length || !timestamps.length) {
      return []
    }
    const size = data.attributes.positions!?.size
    const segments = segmentsIndex.flatMap((segment, i) => {
      const point: Point = {
        longitude: positions[segment],
        latitude: positions[segment + 1],
        timestamp: timestamps[segment / size],
        // segment,
      }
      if (i === 0) {
        return point
      }
      // Inserts first point of next segment
      return [
        point,
        {
          longitude: positions[segment + size],
          latitude: positions[segment + size + 1],
          timestamp: timestamps[segment / size + 1],
          // segment: segment + 1,
        },
      ]
    })
    // Close last segment point
    segments.push({
      longitude: positions[positions.length - size],
      latitude: positions[positions.length - 1],
      timestamp: timestamps[timestamps.length - 1],
      // segment: positions.length,
    })
    return [segments]
  }
}
