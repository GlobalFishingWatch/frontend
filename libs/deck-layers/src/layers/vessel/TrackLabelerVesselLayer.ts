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
  getHighlightColor?: (d: TrackLabelerPoint) => Color
  highlightedTime: { start: string; end: string } | null
}

export class TrackLabelerVesselLayer extends CompositeLayer<TrackLabelerVesselLayerProps> {
  static layerName = 'TrackLabelerVesselLayer'

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { data, getColor, iconAtlasUrl, highlightedTime, getHighlightColor } = this.props
    const path = data.map((d) => d.position)
    return [
      new PathLayer({
        id: `${this.props.id}-track`,
        data: [{ path }],
        getPath: (d) => d.path,
        getColor: [255, 255, 255, 255],
        getWidth: 2,
        widthUnits: 'pixels',
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
      }),
      new IconLayer({
        id: `${this.props.id}-vessel-icons-highlight`,
        data,
        pickable: true,
        iconAtlas: iconAtlasUrl || `${PATH_BASENAME} /vessel-sprite.png`,
        iconMapping: VESSEL_SPRITE_ICON_MAPPING,
        getIcon: () => 'vessel',
        getAngle: (d: any) => d.course,
        getPosition: (d) => d.position,
        getColor: getHighlightColor,
        getSize: 15,
        sizeUnits: 'pixels',
        updateTriggers: {
          getColor: [highlightedTime],
        },
      }),
    ]
  }
}
