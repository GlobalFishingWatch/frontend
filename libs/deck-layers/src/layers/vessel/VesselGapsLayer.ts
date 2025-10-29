import type { Layer, LayerProps, LayersList } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'

import { GAPS_SPRITE_ICON_MAPPING, getLayerGroupOffset, LayerGroup } from '../../utils'
import { PATH_BASENAME } from '../layers.config'

import { VesselPositionIconLayer } from './VesselPositionLayer'

type BluePlanetGapsLayerProps = LayerProps & {
  startTime: number
  endTime: number
}

export class BluePlanetGapsLayer extends CompositeLayer<BluePlanetGapsLayerProps> {
  static layerName = 'BluePlanetGapsLayer'

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { startTime, endTime } = this.props
    const gaps = [
      {
        icon: 'off',
        position: [13.2463, -12.3332],
        timestamp: 1649253360000,
      },
      {
        icon: 'on',
        position: [11.4378, -16.1745],
        timestamp: 1650637380000,
      },
    ].filter((d) => d.timestamp >= startTime && d.timestamp <= endTime)
    return [
      new VesselPositionIconLayer({
        id: `${this.props.id}-blue-planet-gaps`,
        data: gaps,
        // pickable: true,
        iconAtlas: `${PATH_BASENAME}/gaps-sprite.png`,
        iconMapping: GAPS_SPRITE_ICON_MAPPING,
        getIcon: (d) => d.icon,
        getAngle: 0,
        getPosition: (d) => d.position,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        getSize: 30,
        sizeUnits: 'pixels',
      }),
    ]
  }
}
