import { LayerMetadataLegend } from '@globalfishingwatch/layer-composer/dist/types'

export { default } from './use-map-legend'

export type LegendLayer = LayerMetadataLegend & {
  color: string
}
