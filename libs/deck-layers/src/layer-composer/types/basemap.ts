import { BasemapType } from '../../layers/basemap/BasemapLayer'
import { BaseDeckLayerGenerator } from './base'

export interface BasemapDeckLayerGenerator extends BaseDeckLayerGenerator {
  basemap: BasemapType
}
