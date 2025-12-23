import type { Accessor, ChangeFlags, DefaultProps, Position } from '@deck.gl/core'
import { type DataFilterExtensionProps } from '@deck.gl/extensions'
import type { ScatterplotLayerProps } from '@deck.gl/layers'
import { ScatterplotLayer } from '@deck.gl/layers'

import type { EventTypes } from '@globalfishingwatch/api-types'

import { DEFAULT_HIGHLIGHT_COLOR_VEC, EVENT_SHAPES, SHAPES_ORDINALS } from './vessel.config'

export type _VesselEventIconLayerProps<DataT = any> = DataFilterExtensionProps & {
  id: string
  data: DataT
  name?: string
  vesselId?: string
  type: EventTypes
  visibleEvents?: EventTypes[]
  highlightEventIds?: string[]
  highlightStartTime?: number
  highlightEndTime?: number
  getShape?: Accessor<DataT, number>
  getStart?: Accessor<DataT, number>
  getEnd?: Accessor<DataT, number>
  getPosition?: Accessor<DataT, Position> | Position
  getPickingInfo?: Accessor<DataT, string>
  onDataChange?: (dataChange: ChangeFlags['dataChanged']) => void
}

export type VesselEventIconLayerProps<DataT = any> = _VesselEventIconLayerProps<DataT> &
  ScatterplotLayerProps<DataT>

const defaultProps: DefaultProps<VesselEventIconLayerProps> = {
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
    value: (d) => {
      return EVENT_SHAPES[d.type as EventTypes] ?? EVENT_SHAPES.fishing
    },
  },
  getStart: { type: 'accessor', value: (d) => d.start },
  getEnd: { type: 'accessor', value: (d) => d.end },
  getFillColor: { type: 'accessor', value: (d) => [255, 255, 255] },
  getPosition: { type: 'accessor', value: (d) => d.coordinates },
  // getPickingInfo: { type: 'accessor', value: ({ info }) => info },
  visibleEvents: { type: 'accessor', value: [] },
}

const uniformBlock = `
  uniform eventsUniforms {
    uniform float highlightStartTime;
    uniform float highlightEndTime;
  } events;
`

const eventsLayerUniforms = {
  name: 'events',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    highlightStartTime: 'f32',
    highlightEndTime: 'f32',
  },
}

export class VesselEventIconLayer<
  DataT = any,
  ExtraProps = Record<string, unknown>,
> extends ScatterplotLayer<DataT, _VesselEventIconLayerProps & ExtraProps> {
  static layerName = 'VesselEventIconLayer'
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
    const shaders = super.getShaders()
    shaders.modules = [...(shaders.modules || []), eventsLayerUniforms]
    shaders.inject = {
      'vs:#decl': /*glsl*/ `
        in float instanceShapes;
        in float instanceId;
        in float instanceStart;
        in float instanceEnd;

        out float vStart;
        out float vEnd;
        out float vShape;
      `,
      'vs:#main-end': /*glsl*/ `
        vShape = instanceShapes;
        vStart = instanceStart;
        vEnd = instanceEnd;
        if(vStart < events.highlightEndTime && vEnd > events.highlightStartTime) {
          gl_Position.z = 1.0;
        }
      `,
      'fs:#decl': /*glsl*/ `
        in float vShape;
        in float vStart;
        in float vEnd;
        const int SHAPE_SQUARE = ${SHAPES_ORDINALS.square};
        const int SHAPE_DIAMOND = ${SHAPES_ORDINALS.diamond};
        const int SHAPE_DIAMOND_STROKE = ${SHAPES_ORDINALS.diamondStroke};
        const int SHAPE_X = ${SHAPES_ORDINALS.x};
        const int SHAPE_PLUS = ${SHAPES_ORDINALS.plus};
      `,
      'fs:DECKGL_FILTER_COLOR': /*glsl*/ `
        vec2 uv = abs(geometry.uv);
        vec2 uvOriginal = geometry.uv;
        int shape = int(vShape);
        if(vStart < events.highlightEndTime && vEnd > events.highlightStartTime) {
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
        } else if (shape == SHAPE_X) {
          float d1 = abs(uvOriginal.x - uvOriginal.y) / sqrt(2.0);
          float d2 = abs(uvOriginal.x + uvOriginal.y) / sqrt(2.0);
          float lineWidth = 0.15;
          if (d1 > lineWidth && d2 > lineWidth) {
            color = vec4(0,0,0,0);
          }
        } else if (shape == SHAPE_PLUS) {
          float d1 = abs(uvOriginal.x);
          float d2 = abs(uvOriginal.y);
          float lineWidth = 0.15;
          if (d1 > lineWidth && d2 > lineWidth) {
            color = vec4(0,0,0,0);
          }
        }
      `,
    }
    return shaders
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

    if (this.state.model) {
      this.state.model.shaderInputs.setProps({
        events: {
          highlightStartTime: highlightStartTime ? highlightStartTime : 0,
          highlightEndTime: highlightEndTime ? highlightEndTime : 0,
        },
      })
    }

    super.draw(params)
  }
}
