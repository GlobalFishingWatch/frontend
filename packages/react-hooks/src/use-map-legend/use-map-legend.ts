import { useMemo } from 'react'
import { ExtendedStyle, Generators, LayerMetadataLegend } from '@globalfishingwatch/layer-composer'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type {
  LegendLayer,
  LegendLayerBivariate,
} from '@globalfishingwatch/ui-components/dist/map-legend'
import { InteractionEvent } from '../use-map-interaction'

const getLegendLayers = (
  style?: ExtendedStyle,
  dataviews?: UrlDataviewInstance[],
  hoveredEvent?: InteractionEvent | null
) => {
  if (!style) return []
  return style.layers?.flatMap((layer) => {
    if (!layer?.metadata?.legend) return []

    const sublayerLegendsMetadata: LayerMetadataLegend[] = Array.isArray(layer.metadata.legend)
      ? layer.metadata.legend
      : [layer.metadata.legend]

    return sublayerLegendsMetadata.map((sublayerLegendMetadata, sublayerIndex) => {
      const id = sublayerLegendMetadata.id || (layer.metadata?.generatorId as string)
      const dataview = dataviews?.find((d) => d.id === id)
      const sublayerLegend: LegendLayer | LegendLayerBivariate = {
        ...sublayerLegendMetadata,
        id: `legend_${id}`,
        color: layer.metadata?.color || dataview?.config?.color || 'red',
        generatorId: layer.metadata.generatorId,
        generatorType: layer.metadata.generatorType,
      }

      const generatorType = layer.metadata?.generatorType

      if (generatorType === Generators.Type.Heatmap) {
        const value = hoveredEvent?.features?.find(
          (f) => f.generatorId === layer.metadata?.generatorId
        )?.value
        if (value) {
          sublayerLegend.currentValue = value
        }
      } else if (generatorType === Generators.Type.HeatmapAnimated) {
        const getHoveredFeatureValueForSublayerIndex = (index: number): number => {
          const hoveredFeature = hoveredEvent?.features?.find(
            (f) =>
              f.generatorId === layer.metadata?.generatorId &&
              f.temporalgrid?.sublayerIndex === index
          )
          return hoveredFeature?.value
        }
        // Both bivariate sublayers come in the same sublayerLegend (see getLegendsBivariate in LC)
        if (sublayerLegend.type === 'bivariate') {
          sublayerLegend.currentValues = [
            getHoveredFeatureValueForSublayerIndex(0),
            getHoveredFeatureValueForSublayerIndex(1),
          ]
        } else {
          sublayerLegend.currentValue = getHoveredFeatureValueForSublayerIndex(sublayerIndex)
        }
      } else if (generatorType === Generators.Type.UserContext) {
        // TODO use dataset propertyToInclude value
        sublayerLegend.label = ''
      }
      return sublayerLegend
    })
  })
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
