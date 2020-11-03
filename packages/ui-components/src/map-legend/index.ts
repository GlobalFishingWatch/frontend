import {
  LayerMetadataLegend,
  LayerMetadataLegendBivariate,
} from '@globalfishingwatch/layer-composer/dist/types'

export { default, MapLegend } from './MapLegend'
export { default as ColorRampLegend } from './ColorRamp'
export { default as BivariateLegend } from './Bivariate'

// TODO unify this with use-map-legend
export type LegendLayer = LayerMetadataLegend & {
  color: string
}

export type LegendLayerBivariate = LayerMetadataLegendBivariate & {
  color: string
}
