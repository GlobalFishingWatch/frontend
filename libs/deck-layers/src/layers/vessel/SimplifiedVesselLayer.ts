import type { Layer, LayerProps, LayersList } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { IconLayer, PathLayer } from '@deck.gl/layers'
import type { Position } from 'geojson'

import { VESSEL_SPRITE_ICON_MAPPING } from '../../utils'
import { PATH_BASENAME } from '../layers.config'

type SimplifiedVesselLayerProps = LayerProps & {
  data: {
    position: Position[]
    course?: number
    speed?: number
    depth?: number
    timestamp: number
    action: string
  }[]
  iconAtlasUrl?: string
  getColor: (d: LayerProps['data']) => [number, number, number, number]
}

export class SimplifiedVesselLayer extends CompositeLayer<SimplifiedVesselLayerProps> {
  static layerName = 'SimplifiedVesselLayer'

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { data, getColor, iconAtlasUrl } = this.props

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
        getSize: 20,
        sizeUnits: 'pixels',
      }),
    ]
  }
}
