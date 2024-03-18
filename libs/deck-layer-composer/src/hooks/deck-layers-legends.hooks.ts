import { atom, useAtomValue } from 'jotai'
import { FourwingsLayer, FourwingsComparisonMode } from '@globalfishingwatch/deck-layers'
import { GRID_AREA_BY_ZOOM_LEVEL, HEATMAP_DEFAULT_MAX_ZOOM } from '../config'
import { DeckLegend, LegendType } from '../types'
import { deckLayersInteractionAtom } from './deck-layers-interaction.hooks'
import { deckLayersAtom } from './deck-layers.hooks'

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

    let label = layer.instance.props.sublayers[0].config.unit || ''
    if (label === 'hours') {
      const gridZoom = Math.round(
        Math.min(layer.instance.context.viewport.zoom, HEATMAP_DEFAULT_MAX_ZOOM)
      )
      const gridAreaM = GRID_AREA_BY_ZOOM_LEVEL[gridZoom]
      const isSquareKm = (gridAreaM as number) > 50000
      const gridArea = isSquareKm ? (gridAreaM as number) / 1000000 : gridAreaM
      const gridAreaFormatted = gridArea ? `${gridArea}${isSquareKm ? 'km' : 'm'}` : ''
      label = `hours / ${gridAreaFormatted}²`
    }

    return {
      id: layer.id,
      type:
        layer.instance.props.comparisonMode === FourwingsComparisonMode.Bivariate
          ? LegendType.Bivariate
          : LegendType.ColorRampDiscrete,
      sublayers: layer.instance.props.sublayers,
      domain,
      ranges: range,
      currentValues: interaction?.object.values,
      label,
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
