import type {
  LayerMetadataLegend,
  LayerMetadataLegendBivariate,
} from '@globalfishingwatch/layer-composer'

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

export const roundLegendNumber = (number: number) => {
  return number > 1 ? Math.floor(number) : number
}

export const formatLegendValue = (number: number) => {
  return number >= 1000 ? `${(number / 1000).toFixed(1)}k` : number
}
