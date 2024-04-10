import type { Layer } from '@deck.gl/core'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { BaseMapLayer } from './layers/basemap/BasemapLayer'
import type { ContextLayer } from './layers/context/ContextLayer'
import type { FourwingsLayer } from './layers/fourwings/FourwingsLayer'
import type { VesselLayer } from './layers/vessel/VesselLayer'
import type { RulersLayer } from './layers/rulers/RulersLayer'
import { ClusterPickingObject, ClusterPickingInfo, ClusterLayer } from './layers/cluster'
import {
  ContextPickingObject,
  UserContextPickingObject,
  ContextPickingInfo,
} from './layers/context'
import { FourwingsPickingObject, FourwingsPickingInfo } from './layers/fourwings'
import { RulerPickingObject, RulerPickingInfo } from './layers/rulers'
import { VesselEventPickingObject, VesselEventPickingInfo } from './layers/vessel'

export type DeckLayerCategory = `${DataviewCategory}` | 'rulers'

export type BaseLayerProps = {
  category: DeckLayerCategory
}

export type BasePickingInfo = {
  layerId: string
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

export type DeckLayerInteractionFeature =
  | FourwingsPickingObject
  | ContextPickingObject
  | UserContextPickingObject
  | ClusterPickingObject
  | RulerPickingObject
  | VesselEventPickingObject

export type DeckLayerInteractionPickingInfo =
  | (FourwingsPickingInfo & { layer: FourwingsLayer })
  | (ContextPickingInfo & { layer: ContextLayer })
  | (ClusterPickingInfo & { layer: ClusterLayer })
  | (RulerPickingInfo & { layer: RulersLayer })
  | (VesselEventPickingInfo & { layer: VesselLayer })
