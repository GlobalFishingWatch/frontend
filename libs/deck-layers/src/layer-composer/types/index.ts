import { BasemapDeckLayerGenerator } from './basemap'
import { ContextDeckLayerGenerator } from './context'
import { VesselDeckLayersGenerator } from './vessel'
import { FourwingsDataviewCategory, FourwingsDeckLayerGenerator } from './fourwings'

export enum DeckLayersGeneratorType {
  Vessels = 'VESSELS',
  Fourwings = 'FOURWINGS',
}

export type DeckLayersGeneratorDictionary = Partial<
  Record<DeckLayersGeneratorType, AnyDeckLayersGenerator>
>

export {
  BasemapDeckLayerGenerator,
  ContextDeckLayerGenerator,
  VesselDeckLayersGenerator,
  FourwingsDeckLayerGenerator,
}
export type AnyDeckLayersGenerator =
  | BasemapDeckLayerGenerator
  | ContextDeckLayerGenerator
  | VesselDeckLayersGenerator[]
  | { [key in FourwingsDataviewCategory]: FourwingsDeckLayerGenerator[] }
