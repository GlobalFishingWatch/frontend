import type { AccessorFunction, ChangeFlags, DefaultProps, Position } from '@deck.gl/core'
import type { ScatterplotLayerProps } from '@deck.gl/layers'
import { ScatterplotLayer } from '@deck.gl/layers'

import type { EventTypes } from '@globalfishingwatch/api-types'

import { DEFAULT_HIGHLIGHT_COLOR_VEC, EVENT_SHAPES, SHAPES_ORDINALS } from './vessel.config'

export type _VesselEventsLayerProps<DataT = any> = {
  type: EventTypes
  filterRange?: number[]
  visibleEvents?: EventTypes[]
  highlightEventIds?: string[]
  highlightStartTime?: number
  highlightEndTime?: number
  getShape?: AccessorFunction<DataT, number>
  getStart?: AccessorFunction<DataT, number>
  getEnd?: AccessorFunction<DataT, number>
  getPosition?: AccessorFunction<DataT, Position> | Position
  getFilterValue?: AccessorFunction<DataT, number>
  getPickingInfo?: AccessorFunction<DataT, string>
  onDataChange?: (dataChange: ChangeFlags['dataChanged']) => void
}

export type VesselEventsLayerProps<DataT = any> = _VesselEventsLayerProps<DataT> &
  ScatterplotLayerProps<DataT>

const defaultProps: DefaultProps<VesselEventsLayerProps> = {
  filled: { type: 'accessor', value: true },
  opacity: { type: 'accessor', value: 0.8 },
  stroked: { type: 'accessor', value: false },
  filterRange: { type: 'accessor', value: [] },
  radiusScale: { type: 'accessor', value: 1 },
  radiusMinPixels: { type: 'accessor', value: 2 },
  radiusMaxPixels: { type: 'accessor', value: 10 },
  lineWidthMinPixels: { type: 'accessor', value: 1 },
  onDataLoad: { type: 'function', value: () => {} },
  onDataChange: { type: 'function', value: () => {} },
  getShape: {
    type: 'accessor',
    value: (d) => EVENT_SHAPES[d.type as EventTypes] ?? EVENT_SHAPES.fishing,
  },
  getStart: { type: 'accessor', value: (d) => d.start },
  getEnd: { type: 'accessor', value: (d) => d.end },
  getFillColor: { type: 'accessor', value: (d) => [255, 255, 255] },
  getPosition: { type: 'accessor', value: (d) => d.coordinates },
  getPickingInfo: { type: 'accessor', value: ({ info }) => info },
  visibleEvents: { type: 'accessor', value: [] },
}

export class VesselEventsLayer<
  DataT = any,
  ExtraProps = Record<string, unknown>
> extends ScatterplotLayer<DataT, VesselEventsLayerProps & ExtraProps> {
  static layerName = 'VesselEventsLayer'
  static defaultProps = defaultProps

  initializeState() {
    super.initializeState()
    const attributeManager = this.getAttributeManager()
    if (attributeManager) {
      attributeManager.addInstanced({
        instanceShapes: {
          size: 1,
          accessor: 'getShape',
        },
        start: {
          size: 1,
          accessor: 'getStart',
          shaderAttributes: {
            instanceStart: {},
          },
        },
        end: {
          size: 1,
          accessor: 'getEnd',
          shaderAttributes: {
            instanceEnd: {},
          },
        },
      })
    }
  }

  getShaders() {
    return {
      ...super.getShaders(),
      inject: {
        'vs:#decl': `
          uniform float highlightStartTime;
          uniform float highlightEndTime;

          in float instanceShapes;
          in float instanceId;
          in float instanceStart;
          in float instanceEnd;

          out float vStart;
          out float vEnd;
          out float vShape;
        `,
        'vs:#main-end': `
          vShape = instanceShapes;
          vStart = instanceStart;
          vEnd = instanceEnd;
          if(vStart < highlightEndTime && vEnd > highlightStartTime) {
            gl_Position.z = 1.0;
          }
        `,
        'fs:#decl': `
          uniform mat3 hueTransform;
          uniform float highlightStartTime;
          uniform float highlightEndTime;
          in float vShape;
          in float vStart;
          in float vEnd;
          const int SHAPE_SQUARE = ${SHAPES_ORDINALS.square};
          const int SHAPE_DIAMOND = ${SHAPES_ORDINALS.diamond};
          const int SHAPE_DIAMOND_STROKE = ${SHAPES_ORDINALS.diamondStroke};
        `,
        'fs:DECKGL_FILTER_COLOR': `
          vec2 uv = abs(geometry.uv);
          int shape = int(vShape);
          if(vStart < highlightEndTime && vEnd > highlightStartTime) {
            color = vec4(${DEFAULT_HIGHLIGHT_COLOR_VEC.join(',')});
          }
          if (shape == SHAPE_SQUARE) {
            if (uv.x > 0.7 || uv.y > 0.7) {
              color = vec4(0,0,0,0);
            };
          } else if (shape == SHAPE_DIAMOND) {
            if (uv.x + uv.y > 1.0) {
              color = vec4(0,0,0,0);
            };
          } else if (shape == SHAPE_DIAMOND_STROKE) {
            if (uv.x + uv.y > 1.0 || uv.x + uv.y < 0.7) {
              color = vec4(0,0,0,0);
            }
          }
        `,
      },
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
    const { highlightStartTime, highlightEndTime } = this.props

    params.uniforms = {
      ...params.uniforms,
      highlightStartTime: highlightStartTime ? highlightStartTime : 0,
      highlightEndTime: highlightEndTime ? highlightEndTime : 0,
    }
    super.draw(params)
  }
}
