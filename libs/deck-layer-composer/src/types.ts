import type {
  DeckLayerCategory,
  DeckLayerSubcategory,
  FourwingsDeckSublayer,
  FourwingsDeckVectorSublayer,
  FourwingsTileLayerColorDomain,
  FourwingsTileLayerColorRange,
} from '@globalfishingwatch/deck-layers'

export enum LegendType {
  ColorRamp = 'colorramp',
  ColorRampDiscrete = 'colorramp-discrete',
  Solid = 'solid',
  Symbols = 'symbols',
  Bivariate = 'bivariate',
}

export type DeckLegend = {
  id: string
  category: DeckLayerCategory
  subcategory?: DeckLayerSubcategory
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
  sublayers: (FourwingsDeckSublayer | FourwingsDeckVectorSublayer)[]
}

export interface DeckLegendBivariate extends DeckLegend {
  type: LegendType.Bivariate
  currentValues: [number, number]
  sublayersBreaks: [number[], number[]]
  bivariateRamp: string[]
}
