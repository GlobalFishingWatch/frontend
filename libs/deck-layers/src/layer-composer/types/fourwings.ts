import { DataviewCategory } from '@globalfishingwatch/api-types'
import { FourwingsSublayer } from '../../layers/fourwings/fourwings.types'
import { BaseDeckLayerGenerator } from './base'

export interface FourwingsDeckLayerGenerator extends BaseDeckLayerGenerator {
  category: DataviewCategory
  sublayers: FourwingsSublayer[]
}
