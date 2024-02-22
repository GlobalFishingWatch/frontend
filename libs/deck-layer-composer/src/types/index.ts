import { BasemapDeckLayerGenerator } from './basemap'
import { ContextDeckLayerGenerator } from './context'
import { VesselDeckLayersGenerator } from './vessel'
import { FourwingsDeckLayerGenerator, FourwingsDataviewCategory } from './fourwings'

export enum DeckLayersGeneratorType {
  Vessels = 'VESSELS',
  Fourwings = 'FOURWINGS',
}

export type { FourwingsDataviewCategory }

export type {
  BasemapDeckLayerGenerator,
  ContextDeckLayerGenerator,
  VesselDeckLayersGenerator,
  FourwingsDeckLayerGenerator,
}

export type AnyDeckLayersGenerator =
  | BasemapDeckLayerGenerator
  | ContextDeckLayerGenerator
  | VesselDeckLayersGenerator[]
  | FourwingsDeckLayerGenerator[]

export type DeckLayersGeneratorDictionary = Partial<
  Record<DeckLayersGeneratorType, AnyDeckLayersGenerator>
>

export type DeckLayerBaseState = {
  id: string
  loaded?: boolean
}
