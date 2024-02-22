import { BasemapType } from '@globalfishingwatch/deck-layers'
import { BaseDeckLayerGenerator } from './base'

export interface BasemapDeckLayerGenerator extends BaseDeckLayerGenerator {
  basemap: BasemapType
}
