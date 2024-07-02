import { Locale } from '@globalfishingwatch/api-types'
import { BaseLayerProps } from '../../types'

export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
  Labels = 'basemap_labels',
}

export type _BasemapLayerProps = BaseLayerProps & { basemap: BasemapType }
export type _BasemapLabelsLayerProps = BaseLayerProps & { locale?: Locale }
