import { LayerMetadataLegend } from '@globalfishingwatch/layer-composer'

export { default } from './use-map-legend'

export type LegendLayer = LayerMetadataLegend & {
  color: string
}
