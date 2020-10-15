import { Dataset } from '@globalfishingwatch/dataviews-client'
export { useMapHover, useMapClick } from './use-map-interaction'

export type ExtendedFeatureVessel = {
  id: string
  hours: number
  [key: string]: any
}

export type ExtendedFeature = {
  properties: Record<string, any>
  source: string
  sourceLayer: string
  generatorType: string | null
  generatorId: string | number | null
  id?: number
  value: any
  tile: {
    x: number
    y: number
    z: number
  }
  temporalgrid?: {
    sublayerIndex: number
    col: number
    row: number
  }
  vessels?: ExtendedFeatureVessel[]
  dataset?: Dataset
}

export type InteractionEventCallback = (event: InteractionEvent | null) => void

export type InteractionEvent = {
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
}
