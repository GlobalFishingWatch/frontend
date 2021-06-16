import type { Geometry } from 'geojson'
import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Interval } from '@globalfishingwatch/layer-composer/dist/generators'
import { PointerEvent } from '@globalfishingwatch/react-map-gl'

export { useMapHover, useMapClick, useFeatureState } from './use-map-interaction'

export type TemporalGridFeature = {
  sublayerIndex: number
  sublayerId: string
  visible: boolean
  col: number
  row: number
  interval: Interval
  visibleStartFrame: string
  visibleEndFrame: string
}

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
  temporalgrid?: TemporalGridFeature
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
