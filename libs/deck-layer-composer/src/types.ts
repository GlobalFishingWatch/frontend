import {
  ClusterLayer,
  ClusterPickingObject,
  ContextLayer,
  ContextPickingInfo,
  ContextPickingObject,
  FourwingsDeckSublayer,
  FourwingsLayer,
  FourwingsPickingInfo,
  FourwingsPickingObject,
  FourwingsTileLayerColorDomain,
  FourwingsTileLayerColorRange,
  UserContextPickingObject,
} from '@globalfishingwatch/deck-layers'

export const DECK_LAYER_LIFECYCLE = {
  NO_STATE: 'Awaiting state',
  MATCHED: 'Matched. State transferred from previous layer',
  INITIALIZED: 'Initialized',
  AWAITING_GC: 'Discarded. Awaiting garbage collection',
  AWAITING_FINALIZATION: 'No longer matched. Awaiting garbage collection',
  FINALIZED: 'Finalized! Awaiting garbage collection',
} as const

export type DeckLayerLifecycle = (typeof DECK_LAYER_LIFECYCLE)[keyof typeof DECK_LAYER_LIFECYCLE]

export enum LegendType {
  ColorRamp = 'colorramp',
  ColorRampDiscrete = 'colorramp-discrete',
  Solid = 'solid',
  Bivariate = 'bivariate',
}

export type DeckLegend = {
  id: string
  type: LegendType
  label?: string
  unit?: string
  gridArea?: number | string
  domain?: FourwingsTileLayerColorDomain
  ranges?: FourwingsTileLayerColorRange
  color?: string
  loading?: boolean
  currentValues?: number[]
  divergent?: boolean
  sublayers: FourwingsDeckSublayer[]
}

export interface DeckLegendBivariate extends DeckLegend {
  type: LegendType.Bivariate
  currentValues: [number, number]
  sublayersBreaks: [number[], number[]]
  bivariateRamp: string[]
}

export type DeckLayerInteractionFeature =
  | (FourwingsPickingObject & { layer: FourwingsLayer })
  | ((ContextPickingObject | UserContextPickingObject) & { layer: ContextLayer })
  | (ClusterPickingObject & { layer: ClusterLayer })
