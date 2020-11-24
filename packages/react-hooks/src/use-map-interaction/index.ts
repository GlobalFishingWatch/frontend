import { Dataset } from '@globalfishingwatch/api-types'
import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'

export { useMapHover, useMapClick, useFeatureState } from './use-map-interaction'

export type ExtendedFeatureVessel = {
  id: string
  hours: number
  [key: string]: any
}

export type ExtendedFeature = {
  properties: Record<string, any>
  source: string
  sourceLayer: string
  generatorId: string | number | null
  generatorType: string | null
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
  datasetsIds?: string[]
  generatorContextLayer?: ContextLayerType | null
  vessels?: ExtendedFeatureVessel[]
  dataset?: Dataset
}

export type InteractionEventCallback = (event: InteractionEvent | null) => void

export type InteractionEvent = {
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
}
