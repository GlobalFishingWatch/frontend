import type { Accessor, Color, LayerProps } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { CollisionFilterExtension } from '@deck.gl/extensions'
import { IconLayer } from '@deck.gl/layers'
import { bearingToAzimuth } from '@turf/helpers'
import type { Feature, Point } from 'geojson'

import type { DeckLayerProps } from '../../types'
import {
  BLEND_BACKGROUND,
  getLayerGroupOffset,
  LayerGroup,
  VESSEL_SPRITE_ICON_MAPPING,
} from '../../utils'
import { hexToDeckColor } from '../../utils/colors'
import { LabelLayer } from '../labels/LabelLayer'
import { PATH_BASENAME } from '../layers.config'

/** Render paths that represent vessel trips. */
export class VesselPositionIconLayer extends IconLayer {
  static layerName = 'VesselPositionIconLayer'

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#main-end': /*glsl*/ `
        gl_Position.z = 1.0;
      `,
    }
    return shaders
  }
}

export type VesselTrackPositionFeature = Feature<
  Point,
  {
    layerId: string
    course: number
    timestamp: number
    speed: number
    depth: number
  }
>
type _VesselTrackPositionLayerProps = {
  visible: boolean
  iconBorder?: boolean
  iconSize?: number
  data: VesselTrackPositionFeature[]
  getColor: Accessor<VesselTrackPositionFeature, Color>
  name: string
  highlightStartTime: number
}
export type VesselTrackPositionLayerProps = DeckLayerProps<_VesselTrackPositionLayerProps>

export class VesselTrackPositionLayer extends CompositeLayer<
  VesselTrackPositionLayerProps & LayerProps
> {
  static layerName = 'VesselTrackPositionLayer'

  renderLayers() {
    const {
      visible,
      data,
      getColor,
      name,
      highlightStartTime,
      iconBorder = true,
      iconSize = 15,
    } = this.props

    if (!visible || !data || !data?.length) return []

    return [
      new VesselPositionIconLayer(
        this.getSubLayerProps({
          id: 'vessel-position-bg',
          data: data,
          extensions: [new CollisionFilterExtension()],
          iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
          iconMapping: VESSEL_SPRITE_ICON_MAPPING,
          getIcon: () => 'vessel',
          getPosition: (d: VesselTrackPositionFeature) => d.geometry.coordinates,
          getAngle: (d: VesselTrackPositionFeature) => 360 - bearingToAzimuth(d.properties.course),
          getColor: hexToDeckColor(BLEND_BACKGROUND),
          getSize: iconSize + 3,
          pickable: true,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
        })
      ),
      new VesselPositionIconLayer(
        this.getSubLayerProps({
          id: 'vessel-position',
          data: data,
          extensions: [new CollisionFilterExtension()],
          iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
          iconMapping: VESSEL_SPRITE_ICON_MAPPING,
          getIcon: () => 'vessel',
          getPosition: (d: VesselTrackPositionFeature) => d.geometry.coordinates,
          getAngle: (d: any) => 360 - bearingToAzimuth(d.properties.course),
          getColor,
          getSize: iconSize,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
        })
      ),
      ...(iconBorder
        ? [
            new VesselPositionIconLayer(
              this.getSubLayerProps({
                id: 'vessel-position-hg',
                data: data,
                extensions: [new CollisionFilterExtension()],
                iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
                iconMapping: VESSEL_SPRITE_ICON_MAPPING,
                getIcon: () => 'vesselHighlight',
                getPosition: (d: VesselTrackPositionFeature) => d.geometry.coordinates,
                getAngle: (d: VesselTrackPositionFeature) =>
                  360 - bearingToAzimuth(d.properties.course),
                getColor: [255, 255, 255, 255],
                getSize: iconSize,
                getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Overlay, params),
              })
            ),
          ]
        : []),
      ...(name && highlightStartTime
        ? [
            new LabelLayer({
              id: `${this.props.id}-vessel-position-label`,
              data: data,
              getText: () => name,
            }),
          ]
        : []),
    ]
  }
}
