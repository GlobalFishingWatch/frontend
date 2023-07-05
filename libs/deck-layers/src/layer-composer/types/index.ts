import { BasemapDeckLayerGenerator } from './basemap'
import { ContextDeckLayerGenerator } from './context'
import { VesselDeckLayersGenerator } from './vessel'
import { FourwingsDeckLayerGenerator, FourwingsDataviewCategory } from './fourwings'

export enum DeckLayersGeneratorType {
  Vessels = 'VESSELS',
  Fourwings = 'FOURWINGS',
}

export { FourwingsDataviewCategory }

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
  | FourwingsDeckLayerGenerator[]

export type DeckLayersGeneratorDictionary = Partial<
  Record<DeckLayersGeneratorType, AnyDeckLayersGenerator>
>
