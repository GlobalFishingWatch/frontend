import type { AccessorFunction, ChangeFlags, DefaultProps } from '@deck.gl/core'
import type { PathLayerProps } from '@deck.gl/layers'
import { PathLayer } from '@deck.gl/layers'
import type { NumericArray } from '@math.gl/core'

import type { ThinningLevels } from '@globalfishingwatch/api-client'
import type { TrackSegment } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import type { VesselTrackData, VesselTrackGraphExtent } from '@globalfishingwatch/deck-loaders'

import { colorToVec, hexToDeckColor } from '../../utils/colors'
import { MAX_FILTER_VALUE } from '../layers.config'

import { DEFAULT_HIGHLIGHT_COLOR_VEC } from './vessel.config'
import type { GetSegmentsFromDataParams } from './vessel.utils'
import { generateVesselGraphSteps, getSegmentsFromData, VESSEL_GRAPH_STEPS } from './vessel.utils'

export type VesselsColorByProperty = 'track' | 'speed' | 'elevation'
export type VesselsColorByValue = 1 | 2 | 3
export const COLOR_BY: Record<VesselsColorByProperty, VesselsColorByValue> = {
  track: 1,
  speed: 2,
  elevation: 3,
}

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
  colorBy?: VesselsColorByProperty
  /**
   * Tracks thinning config {[minZoomLevel]: params }
   * e.g. To apply Insane between 0 and 4 zoom levels, and Aggresive for higher
   * { 0: ThinningLevels.Insane, 4: ThinningLevels.Aggressive }
   */
  trackThinningZoomConfig?: Record<number, ThinningLevels>
  /**
   * Domain for the speed or elevation graph
   */
  trackGraphExtent?: VesselTrackGraphExtent
}

function generateShaderColorSteps({
  property,
  operation,
  stepsNum = VESSEL_GRAPH_STEPS,
}: {
  property: 'vSpeed' | 'vElevation'
  operation: '>=' | '<='
  stepsNum?: number
}) {
  return [...Array(stepsNum)]
    .map((_, index) => {
      if (index === stepsNum - 1) {
        return `{ color = color${index}; }`
      }
      return `if (${property} ${operation} value${index}) { color = color${index}; }`
    })
    .join(' else ')
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
        uniform float value0;
        uniform float value1;
        uniform float value2;
        uniform float value3;
        uniform float value4;
        uniform float value5;
        uniform float value6;
        uniform float value7;
        uniform float value8;
        uniform float value9;
        uniform vec4 color0;
        uniform vec4 color1;
        uniform vec4 color2;
        uniform vec4 color3;
        uniform vec4 color4;
        uniform vec4 color5;
        uniform vec4 color6;
        uniform vec4 color7;
        uniform vec4 color8;
        uniform vec4 color9;
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
        if(colorBy == ${COLOR_BY.speed}) {
          ${generateShaderColorSteps({
            property: 'vSpeed',
            operation: '<=',
          })}
        } else if(colorBy == ${COLOR_BY.elevation}){
          ${generateShaderColorSteps({
            property: 'vElevation',
            operation: '>=',
          })}
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

  draw(params: any) {
    const {
      startTime,
      endTime,
      trackGraphExtent,
      highlightStartTime = 0,
      highlightEndTime = 0,
      minSpeedFilter = -MAX_FILTER_VALUE,
      maxSpeedFilter = MAX_FILTER_VALUE,
      minElevationFilter = -MAX_FILTER_VALUE,
      maxElevationFilter = MAX_FILTER_VALUE,
      colorBy,
    } = this.props

    const steps =
      trackGraphExtent && colorBy ? generateVesselGraphSteps(trackGraphExtent, colorBy) : []

    const values = steps.reduce(
      (acc, step, index) => {
        acc[`value${index}`] = step.value
        return acc
      },
      {} as Record<string, number>
    )

    const colors = steps.reduce(
      (acc, step, index) => {
        acc[`color${index}`] = (hexToDeckColor(step.color) as number[]).map((c) => colorToVec(c))
        return acc
      },
      {} as Record<string, number[]>
    )

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
      colorBy: colorBy ? COLOR_BY[colorBy] : COLOR_BY.track,
      ...values,
      ...colors,
    }
    super.draw(params)
  }

  getData(): VesselTrackData {
    return this.props.data as VesselTrackData
  }

  getSegments(param = {} as GetSegmentsFromDataParams): TrackSegment[] {
    return getSegmentsFromData(this.props.data as VesselTrackData, param)
  }

  getGraphExtent(graph: 'speed' | 'elevation'): VesselTrackGraphExtent {
    const selector = graph === 'speed' ? 'getSpeed' : 'getElevation'
    const extent = (this.props.data as VesselTrackData).attributes?.[selector]?.extent
    return extent
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
