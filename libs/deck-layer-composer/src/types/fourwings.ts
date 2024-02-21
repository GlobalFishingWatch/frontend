import { FourwingsDeckSublayer } from '../../layers/fourwings/fourwings.types'
import { BaseDeckLayerGenerator } from './base'

export enum FourwingsDataviewCategory {
  Environment = 'environment',
  Activity = 'activity',
  Detections = 'detections',
}

export interface FourwingsDeckLayerGenerator extends Omit<BaseDeckLayerGenerator, 'id'> {
  id: FourwingsDataviewCategory
  sublayers: FourwingsDeckSublayer[]
}
