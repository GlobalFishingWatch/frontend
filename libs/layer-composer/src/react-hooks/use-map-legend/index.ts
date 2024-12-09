import type {
  LayerMetadataLegend,
  LayerMetadataLegendBivariate,
} from '@globalfishingwatch/layer-composer'

// Duplicated from ui-components map-legend to avoid circular dependencies
type UILayer = {
  color: string
  generatorId: string
  generatorType: string
}

export type LegendLayer = LayerMetadataLegend & UILayer

export type LegendLayerBivariate = LayerMetadataLegendBivariate & UILayer

export * from './use-map-legend'
