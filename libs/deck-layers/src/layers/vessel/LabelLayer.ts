import type { Accessor, LayerContext, LayerProps, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TextLayerProps } from '@deck.gl/layers'
import { TextLayer } from '@deck.gl/layers'
import type { Feature, Point } from '@loaders.gl/schema'

import { BLEND_BACKGROUND } from '../../utils'
import { hexToDeckColor } from '../../utils/colors'
import { DECK_FONT, loadDeckFont } from '../../utils/fonts'

type LabelLayerState = {
  fontLoaded: boolean
}

type LabelLayerProps<DataT> = {
  getPickingInfo?: ({ info }: { info: PickingInfo<DataT> }) => typeof info
  getCollisionPriority?: Accessor<DataT, number>
  collisionTestProps?: Record<TextLayerProps, number>
}

export class LabelLayer<DataT = unknown> extends CompositeLayer<
  TextLayerProps<DataT> & LayerProps & LabelLayerProps<DataT>
> {
  static layerName = 'LabelLayer'
  static defaultProps = {
    getColor: [255, 255, 255, 255],
    getSize: 14,
    outlineColor: hexToDeckColor(BLEND_BACKGROUND, 0.5),
    characterSet:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789áàâãåäçèéêëìíîïñòóôöõøùúûüýÿÁÀÂÃÅÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÕØÙÚÛÜÝŸÑæÆ -./|()',
    outlineWidth: 20,
    fontSettings: { sdf: true, smoothing: 0.2, buffer: 15 },
    sizeUnits: 'pixels',
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'center',
    pickable: false,
    fontFamily: DECK_FONT,
    transitions: {
      getPosition: 50,
    },
    getPixelOffset: [0, -15],
    getPosition: (d: Feature<Point>) => d.geometry.coordinates,
    parameters: {
      depthCompare: 'always',
    },
  }
  state!: LabelLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    if (typeof document !== 'undefined') {
      loadDeckFont().then((loaded) => {
        this.setState({ fontLoaded: loaded })
      })
    }
    this.state = {
      fontLoaded: false,
    }
  }

  renderLayers(): LayersList {
    if (!this.state.fontLoaded) return []
    return [
      new TextLayer(
        this.props,
        this.getSubLayerProps({
          id: `${this.props.id}-text`,
          updateTriggers: this.props.updateTriggers,
        })
      ),
    ]
  }
}
