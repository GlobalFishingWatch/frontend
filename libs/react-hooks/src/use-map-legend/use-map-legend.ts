import { useMemo } from 'react'
import {
  ExtendedStyle,
  GeneratorType,
  LayerMetadataLegend,
} from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { InteractionEvent } from '../use-map-interaction'
import type { LegendLayer, LegendLayerBivariate } from './index'

export const getLegendId = (id = '') => {
  return `legend_${id}`
}

export const getLegendLayers = (
  style?: ExtendedStyle,
  dataviews?: UrlDataviewInstance[],
  hoveredEvent?: InteractionEvent | null
) => {
  if (!style) return []

  const heatmapLegends = Object.entries(style.metadata?.generatorsMetadata || {}).flatMap(
    ([generatorId, { legends }]) => {
      return legends?.flatMap((legend: LayerMetadataLegend) => {
        if (!legend) return []

        let currentValue
        let currentValues
        const getHoveredFeatureValueForSublayerId = (id: string): number => {
          const hoveredFeature = hoveredEvent?.features?.find((f) => {
            const matchesGeneratorId = f.generatorId === generatorId
            const matchesTemporalGridSublayerId = f.temporalgrid
              ? f.temporalgrid.sublayerId === id
              : true
            return matchesGeneratorId && matchesTemporalGridSublayerId
          })
          return hoveredFeature?.value
        }
        // Both bivariate sublayers come in the same sublayerLegend (see getLegendsBivariate in LC)
        if (legend.type === 'bivariate') {
          currentValues = [
            getHoveredFeatureValueForSublayerId(legend.ids[0]),
            getHoveredFeatureValueForSublayerId(legend.ids[1]),
          ]
        } else {
          currentValue = getHoveredFeatureValueForSublayerId(legend.id)
        }
        const dataview = dataviews?.find((d) => d.id === legend.id)

        return {
          ...legend,
          id: getLegendId(legend?.id),
          category: dataview?.category,
          generatorId,
          generatorType: GeneratorType.HeatmapAnimated,
          currentValue,
          currentValues,
        } as LegendLayer | LegendLayerBivariate
      })
    }
  )

  const layerLegends =
    style.layers?.flatMap((layer) => {
      if (!layer?.metadata?.legend) return []

      const sublayerLegendsMetadata: LayerMetadataLegend[] = Array.isArray(layer.metadata.legend)
        ? layer.metadata.legend
        : [layer.metadata.legend]

      return (
        sublayerLegendsMetadata.map((sublayerLegendMetadata) => {
          const id = sublayerLegendMetadata?.id || (layer.metadata?.generatorId as string)
          const dataview = dataviews?.find((d) => d.id === id)
          const sublayerLegend: LegendLayer = {
            ...sublayerLegendMetadata,
            id: getLegendId(id),
            color: layer.metadata?.color || dataview?.config?.color || 'red',
            generatorId: layer.metadata?.generatorId || '',
            generatorType: layer.metadata?.generatorType || '',
          }
          return sublayerLegend
        }) || []
      )
    }) || []

  const legends = [...heatmapLegends, ...layerLegends].map((legend) => {
    const { generatorType, generatorId } = legend
    let currentValue = legend.currentValue
    if (generatorType === GeneratorType.Heatmap) {
      const value = hoveredEvent?.features?.find((f) => f.generatorId === generatorId)?.value
      if (value) {
        currentValue = value
      }
    }
    // TODO use dataset propertyToInclude value
    const label = generatorType === GeneratorType.UserContext ? '' : legend.label
    return { ...legend, currentValue, label }
  })

  return legends as (LegendLayer | LegendLayerBivariate)[]
}

export function useMapLegend(
  style?: ExtendedStyle,
  dataviews?: UrlDataviewInstance[],
  interactionEvent?: InteractionEvent | null
) {
  const legendLayers = useMemo(() => {
    if (!style) return
    return getLegendLayers(style, dataviews, interactionEvent)
  }, [style, dataviews, interactionEvent])
  return legendLayers
}
