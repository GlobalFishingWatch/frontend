import { FourwingsDeckSublayer } from '@globalfishingwatch/deck-layers'
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
