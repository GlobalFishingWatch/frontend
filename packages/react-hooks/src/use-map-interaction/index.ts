import type { Geometry } from 'geojson'
import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { PointerEvent } from '@globalfishingwatch/react-map-gl'

export { useMapHover, useMapClick, useFeatureState } from './use-map-interaction'

export type ExtendedFeature = {
  properties: Record<string, any>
  layerId: string
  source: string
  sourceLayer: string
  generatorId: string | number | null
  generatorType: string | null
  id: string
  value: any
  unit?: string
  tile: {
    x: number
    y: number
    z: number
  }
  temporalgrid?: {
    sublayerIndex: number
    sublayerId: string
    visible: boolean
    col: number
    row: number
  }
  uniqueFeatureInteraction?: boolean
  generatorContextLayer?: ContextLayerType | null
  geometry?: Geometry
}

export type InteractionEventCallback = (event: InteractionEvent | null) => void

export type InteractionEvent = {
  type: 'click' | 'hover'
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
  point: Pick<PointerEvent, 'point'>
}
