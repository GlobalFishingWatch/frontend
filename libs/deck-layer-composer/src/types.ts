export const DECK_LAYER_LIFECYCLE = {
  NO_STATE: 'Awaiting state',
  MATCHED: 'Matched. State transferred from previous layer',
  INITIALIZED: 'Initialized',
  AWAITING_GC: 'Discarded. Awaiting garbage collection',
  AWAITING_FINALIZATION: 'No longer matched. Awaiting garbage collection',
  FINALIZED: 'Finalized! Awaiting garbage collection',
} as const

export type DeckLayerLifecycle = (typeof DECK_LAYER_LIFECYCLE)[keyof typeof DECK_LAYER_LIFECYCLE]
