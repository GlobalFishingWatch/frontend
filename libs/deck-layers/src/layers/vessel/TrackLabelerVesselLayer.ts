import type { Color, Layer, LayerProps, LayersList } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { IconLayer, PathLayer } from '@deck.gl/layers'

import { VESSEL_SPRITE_ICON_MAPPING } from '../../utils'
import { PATH_BASENAME } from '../layers.config'

import type { TrackLabelerPoint } from './vessel.types'

type TrackLabelerVesselLayerProps = LayerProps & {
  data: TrackLabelerPoint[]
  iconAtlasUrl?: string
  getColor: (d: TrackLabelerPoint) => Color
  highlightedTime: { start: string; end: string } | null
}

export class TrackLabelerVesselLayer extends CompositeLayer<TrackLabelerVesselLayerProps> {
  static layerName = 'TrackLabelerVesselLayer'

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { data, getColor, iconAtlasUrl, highlightedTime } = this.props

    return [
      new PathLayer({
        id: `${this.props.id}-track`,
        data,
        getPath: (d) => d.position,
        getColor: [255, 255, 255, 255],
        getWidth: 20,
      }),
      new IconLayer({
        id: `${this.props.id}-vessel-icons`,
        data,
        pickable: true,
        iconAtlas: iconAtlasUrl || `${PATH_BASENAME} /vessel-sprite.png`,
        iconMapping: VESSEL_SPRITE_ICON_MAPPING,
        getIcon: () => 'vessel',
        getAngle: (d: any) => d.course,
        getPosition: (d) => d.position,
        getColor,
        getSize: 15,
        sizeUnits: 'pixels',
        updateTriggers: {
          getColor: [highlightedTime],
        },
      }),
    ]
  }
}
