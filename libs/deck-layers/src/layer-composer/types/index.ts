import { BasemapDeckLayerGenerator } from './basemap'
import { VesselDeckLayersGenerator } from './vessel'
import { FourwingsDataviewCategory, FourwingsDeckLayerGenerator } from './fourwings'

export enum DeckLayersGeneratorType {
  Vessels = 'VESSELS',
  Fourwings = 'FOURWINGS',
}

export type DeckLayersGeneratorDictionary = Partial<
  Record<DeckLayersGeneratorType, AnyDeckLayersGenerator>
>

export { BasemapDeckLayerGenerator, VesselDeckLayersGenerator, FourwingsDeckLayerGenerator }
export type AnyDeckLayersGenerator =
  | BasemapDeckLayerGenerator
  | VesselDeckLayersGenerator[]
  | { [key in FourwingsDataviewCategory]: FourwingsDeckLayerGenerator[] }
