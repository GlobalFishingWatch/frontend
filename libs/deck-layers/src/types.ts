import type { Layer } from '@deck.gl/core'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { BaseMapLayer } from './layers/basemap/BasemapLayer'
import type { ContextLayer } from './layers/context/ContextLayer'
import type { FourwingsLayer } from './layers/fourwings/FourwingsLayer'
import type { VesselLayer } from './layers/vessel/VesselLayer'
import type { RulersLayer } from './layers/rulers/RulersLayer'

export type DeckLayerCategory = `${DataviewCategory}` | 'rulers'

export type BaseLayerProps = {
  category: DeckLayerCategory
}

export type BasePickingInfo = {
  category: DeckLayerCategory
}

export type AnyDeckLayer<D extends {} = {}> =
  | Layer<D>
  | BaseMapLayer
  | ContextLayer
  | FourwingsLayer
  | VesselLayer
  | RulersLayer

export type LayerWithIndependentSublayersLoadState = VesselLayer
