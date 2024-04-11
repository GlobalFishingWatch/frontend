import { BaseLayerProps } from '../../types'

export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
  Labels = 'basemap_labels',
}

export type _BasemapLayerProps = BaseLayerProps & { basemap: BasemapType }
