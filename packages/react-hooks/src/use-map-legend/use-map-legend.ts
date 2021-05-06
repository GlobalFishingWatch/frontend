import { useMemo } from 'react'
import { ExtendedStyle, Generators, LayerMetadataLegend } from '@globalfishingwatch/layer-composer'
import {
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import type {
  LegendLayer,
  LegendLayerBivariate,
} from '@globalfishingwatch/ui-components/dist/map-legend'
import { InteractionEvent } from '../use-map-interaction'

const getLegendId = (id = '') => {
  return `legend_${id}`
}

const getLegendLayers = (
  style?: ExtendedStyle,
  dataviews?: UrlDataviewInstance[],
  hoveredEvent?: InteractionEvent | null
) => {
  if (!style) return []
  const heatmapGeneratorsMetadata =
    style.metadata?.generatorsMetadata?.[MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID]
  const heatmapLegends =
    heatmapGeneratorsMetadata?.legends?.flatMap(
      (legend: LayerMetadataLegend, sublayerIndex: number) => {
        if (!legend) return []

        const generatorId = MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID
        let currentValue
        let currentValues
        const getHoveredFeatureValueForSublayerIndex = (index: number): number => {
          const hoveredFeature = hoveredEvent?.features?.find(
            (f) => f.generatorId === generatorId && f.temporalgrid?.sublayerIndex === index
          )
          return hoveredFeature?.value
        }
        // Both bivariate sublayers come in the same sublayerLegend (see getLegendsBivariate in LC)
        if (legend.type === 'bivariate') {
          currentValues = [
            getHoveredFeatureValueForSublayerIndex(0),
            getHoveredFeatureValueForSublayerIndex(1),
          ]
        } else {
          currentValue = getHoveredFeatureValueForSublayerIndex(sublayerIndex)
        }

        return {
          ...legend,
          id: getLegendId(legend?.id),
          generatorId,
          generatorType: Generators.Type.HeatmapAnimated,
          currentValue,
          currentValues,
        } as LegendLayer | LegendLayerBivariate
      }
    ) || []

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
            generatorId: layer.metadata.generatorId,
            generatorType: layer.metadata.generatorType,
          }
          return sublayerLegend
        }) || []
      )
    }) || []

  const legends = [...heatmapLegends, ...layerLegends].map((legend) => {
    const { generatorType, generatorId } = legend
    let currentValue
    if (generatorType === Generators.Type.Heatmap) {
      const value = hoveredEvent?.features?.find((f) => f.generatorId === generatorId)?.value
      if (value) {
        currentValue = value
      }
    }
    // TODO use dataset propertyToInclude value
    const label = generatorType === Generators.Type.UserContext ? '' : legend.label
    return { ...legend, currentValue, label }
  })

  return legends as (LegendLayer | LegendLayerBivariate)[]
}

function useMapLegend(
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
export default useMapLegend
