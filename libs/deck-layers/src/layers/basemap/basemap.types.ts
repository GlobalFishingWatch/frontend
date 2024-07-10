import { Locale } from '@globalfishingwatch/api-types'
import { DeckLayerProps } from '../../types'

export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
  Labels = 'basemap_labels',
}

export type _BasemapLayerProps = DeckLayerProps<{ basemap: BasemapType }>
export type _BasemapLabelsLayerProps = DeckLayerProps<{ locale?: Locale }>