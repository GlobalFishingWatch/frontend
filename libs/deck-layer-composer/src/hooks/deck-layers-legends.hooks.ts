import { atom, useAtomValue } from 'jotai'
import {
  FourwingsLayer,
  FourwingsComparisonMode,
  FourwingsPickingObject,
  getBivariateRampLegend,
  ColorRampId,
  HEATMAP_ID,
} from '@globalfishingwatch/deck-layers'
import { GRID_AREA_BY_ZOOM_LEVEL, HEATMAP_DEFAULT_MAX_ZOOM } from '../config'
import { DeckLegend, LegendType } from '../types'
import { deckHoverInteractionAtom } from '../interactions'
import { deckLayersAtom } from './deck-layers.hooks'

export const deckLayersLegendsAtom = atom<DeckLegend[]>((get) => {
  const deckLayers = get(deckLayersAtom)
  const deckLayerHoverFeatures = get(deckHoverInteractionAtom)
  return deckLayers.flatMap((layer) => {
    if (!layer.instance || !(layer.instance instanceof FourwingsLayer)) {
      return []
    }
    const interaction = (deckLayerHoverFeatures?.features as FourwingsPickingObject[])?.find(
      (feature) => feature.layerId === layer.id
    )
    const { colorDomain, colorRange } = layer.instance.getColorScale() || {}
    const visualizationMode = layer.instance.getVisualizationMode()
    let label = layer.instance.props.sublayers?.[0]?.unit || ''
    if (label === 'hours' && visualizationMode === HEATMAP_ID) {
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
      domain: colorDomain,
      ranges:
        layer.instance.props.comparisonMode === FourwingsComparisonMode.Bivariate
          ? getBivariateRampLegend(
              layer.instance.props.sublayers.map((sublayer) => sublayer.colorRamp as ColorRampId)
            )
          : colorRange,
      currentValues: (interaction as FourwingsPickingObject)?.sublayers?.map((s: any) => s.value)!,
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
