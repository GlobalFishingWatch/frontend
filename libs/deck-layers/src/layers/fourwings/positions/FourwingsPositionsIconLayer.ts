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
}

export type FourwingsPositionsIconLayerProps<DataT = any> = IconLayerProps<DataT> &
  _FourwingsPositionsIconLayerProps<DataT>

const defaultProps: DefaultProps<FourwingsPositionsIconLayerProps> = {
  getHighlighted: { type: 'accessor', value: 0 },
  getStime: { type: 'accessor', value: 0 },
  dimOpacity: { type: 'number', value: 1 },
  highlightTimeStart: { type: 'number', value: 0 },
  highlightTimeEnd: { type: 'number', value: 0 },
}

const uniformBlock = /* glsl */ `
  uniform positionsHighlightUniforms {
    float dimOpacity;
    float highlightTimeStart;
    float highlightTimeEnd;
  } positionsHighlight;
`

const positionsHighlightUniforms = {
  name: 'positionsHighlight',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    dimOpacity: 'f32',
    highlightTimeStart: 'f32',
    highlightTimeEnd: 'f32',
  },
} as const

/**
 * IconLayer that fades every position not belonging to the highlighted vessel, and lights up the
 * ones inside the highlighted time range.
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
    })
  }

  getShaders() {
    const shaders = super.getShaders()
    shaders.modules = [...(shaders.modules || []), positionsHighlightUniforms]
    shaders.inject = {
      'vs:#decl': /* glsl */ `
        in float instanceHighlighted;
        in float instanceStime;
        out float vHighlighted;
        out float vStime;
      `,
      'vs:#main-end': /* glsl */ `
        vHighlighted = instanceHighlighted;
        vStime = instanceStime;
      `,
      'fs:#decl': /* glsl */ `
        in float vHighlighted;
        in float vStime;
      `,
      'fs:DECKGL_FILTER_COLOR': /* glsl */ `
        float highlighted = vHighlighted;
        if (positionsHighlight.highlightTimeEnd > positionsHighlight.highlightTimeStart &&
            vStime >= positionsHighlight.highlightTimeStart &&
            vStime < positionsHighlight.highlightTimeEnd) {
          highlighted = 1.0;
        }
        color.a *= mix(positionsHighlight.dimOpacity, 1.0, highlighted);
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
