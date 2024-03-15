import { atom, useAtomValue } from 'jotai'
import {
  FourwingsDeckSublayer,
  FourwingsLayer,
  FourwingsTileLayerColorDomain,
  FourwingsTileLayerColorRange,
  HeatmapAnimatedMode,
} from '@globalfishingwatch/deck-layers'
import { deckLayersInteractionAtom } from './deck-layers-interaction.hooks'
import { deckLayersAtom } from './deck-layers.hooks'

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

export const deckLayersLegendsAtom = atom<DeckLegend[]>((get) => {
  const deckLayers = get(deckLayersAtom)
  const deckLayerInteractions = get(deckLayersInteractionAtom)
  return deckLayers.flatMap((layer) => {
    if (!layer.instance || !(layer.instance instanceof FourwingsLayer)) {
      return []
    }
    const interaction = deckLayerInteractions.find((i) => i.layer?.id === layer.id)
    const { domain, range } = layer.instance.getColorScale() || {}
    if (!domain || !range) {
      // TODO: handle when the layer does not have a color scale because the state is not ready after an update
    }
    return {
      id: layer.id,
      // category: layer.instance.props.category,
      type:
        layer.instance.props.comparisonMode === HeatmapAnimatedMode.Bivariate
          ? LegendType.Bivariate
          : LegendType.ColorRampDiscrete,
      sublayers: layer.instance.props.sublayers,
      domain,
      ranges: range,
      currentValues: interaction?.object.values,
    }
  })
})

export const useDeckLegends = () => {
  return useAtomValue(deckLayersLegendsAtom)
}

export const useGetDeckLayerLegend = (id: string) => {
  const deckLayers = useDeckLegends()
  return deckLayers.find((layer) => layer.id === id)
}

export const useGetDeckLayerLegends = (ids: string[]) => {
  const deckLayers = useDeckLegends()
  return deckLayers.filter((layer) => ids.includes(layer.id))
}
