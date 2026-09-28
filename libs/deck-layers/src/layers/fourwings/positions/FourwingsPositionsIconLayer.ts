import type { Accessor, DefaultProps } from '@deck.gl/core'
import type { IconLayerProps } from '@deck.gl/layers'
import { IconLayer } from '@deck.gl/layers'

export type _FourwingsPositionsIconLayerProps<DataT = any> = {
  /** 1 when the feature belongs to a highlighted vessel, 0 otherwise */
  getHighlighted?: Accessor<DataT, number>
  /**
   * Seconds relative to `timestampBase` — never an absolute epoch, which does not survive the
   * Float32Array the attribute is packed into. Same rebasing the track loader does, see
   * `toRelativeTimestamp` in libs/deck-loaders/src/vessels/lib/parse-tracks.ts.
   * Leave unset on layers that do not highlight by time: a constant accessor costs no buffer.
   */
  getStime?: Accessor<DataT, number>
  /** alpha multiplier for everything not highlighted. 1 disables the effect */
  dimOpacity?: number
  /**
   * Highlighted time range, in the same rebased seconds as `getStime`. end <= start disables it.
   * Deliberately NOT named highlightStartTime/highlightEndTime: the parent layer has props by those
   * names holding absolute epoch ms, and they would be spread onto this layer and silently misread.
   */
  highlightTimeStart?: number
  highlightTimeEnd?: number
  /** icon size multiplier applied while the position is highlighted, by vessel or by time */
  getHighlightScale?: Accessor<DataT, number>
}

export type FourwingsPositionsIconLayerProps<DataT = any> = IconLayerProps<DataT> &
  _FourwingsPositionsIconLayerProps<DataT>

const defaultProps: DefaultProps<FourwingsPositionsIconLayerProps> = {
  getHighlighted: { type: 'accessor', value: 0 },
  getStime: { type: 'accessor', value: 0 },
  dimOpacity: { type: 'number', value: 1 },
  highlightTimeStart: { type: 'number', value: 0 },
  highlightTimeEnd: { type: 'number', value: 0 },
  getHighlightScale: { type: 'accessor', value: 1 },
}

const uniformBlock = /* glsl */ `
  uniform positionsHighlightUniforms {
    float dimOpacity;
    float highlightTimeStart;
    float highlightTimeEnd;
  } positionsHighlight;
`

const vsModuleSource = /* glsl */ `${uniformBlock}
  float positions_isHighlighted(float vesselHighlighted, float stime) {
    if (positionsHighlight.highlightTimeEnd > positionsHighlight.highlightTimeStart &&
        stime >= positionsHighlight.highlightTimeStart &&
        stime < positionsHighlight.highlightTimeEnd) {
      return 1.0;
    }
    return vesselHighlighted;
  }
`

const positionsHighlightUniforms = {
  name: 'positionsHighlight',
  vs: vsModuleSource,
  fs: uniformBlock,
  uniformTypes: {
    dimOpacity: 'f32',
    highlightTimeStart: 'f32',
    highlightTimeEnd: 'f32',
  },
} as const

/**
 * IconLayer that fades every position not belonging to the highlighted vessel, and lights up and
 * enlarges the ones of that vessel or inside the highlighted time range.
 */
export class FourwingsPositionsIconLayer<
  DataT = any,
  ExtraProps = Record<string, unknown>,
> extends IconLayer<DataT, _FourwingsPositionsIconLayerProps<DataT> & ExtraProps> {
  static layerName = 'FourwingsPositionsIconLayer'
  static defaultProps = defaultProps

  initializeState() {
    super.initializeState()
    this.getAttributeManager()?.addInstanced({
      instanceHighlighted: { size: 1, accessor: 'getHighlighted', defaultValue: 0 },
      instanceStime: { size: 1, accessor: 'getStime', defaultValue: 0 },
      instanceHighlightScale: { size: 1, accessor: 'getHighlightScale', defaultValue: 1 },
    })
  }

  getShaders() {
    const shaders = super.getShaders()
    shaders.modules = [...(shaders.modules || []), positionsHighlightUniforms]
    shaders.inject = {
      'vs:#decl': /* glsl */ `
        in float instanceHighlighted;
        in float instanceStime;
        in float instanceHighlightScale;
        out float vHighlighted;
      `,
      // luma emits #decl before the hook functions, so the hook can read the instance attributes
      'vs:DECKGL_FILTER_SIZE': /* glsl */ `
        size *= mix(1.0, instanceHighlightScale,
          positions_isHighlighted(instanceHighlighted, instanceStime));
      `,
      'vs:#main-end': /* glsl */ `
        vHighlighted = positions_isHighlighted(instanceHighlighted, instanceStime);
      `,
      'fs:#decl': /* glsl */ `
        in float vHighlighted;
      `,
      'fs:DECKGL_FILTER_COLOR': /* glsl */ `
        color.a *= mix(positionsHighlight.dimOpacity, 1.0, vHighlighted);
      `,
    }
    return shaders
  }

  draw(params: any) {
    if (this.state.model) {
      this.state.model.shaderInputs.setProps({
        positionsHighlight: {
          dimOpacity: this.props.dimOpacity ?? 1,
          highlightTimeStart: this.props.highlightTimeStart ?? 0,
          highlightTimeEnd: this.props.highlightTimeEnd ?? 0,
        },
      })
    }
    super.draw(params)
  }
}
