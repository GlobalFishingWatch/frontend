import type { Layer } from '@deck.gl/core'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { PolygonPickingObject } from '@globalfishingwatch/deck-layers'
import type { BaseMapLayer } from './layers/basemap/BasemapLayer'
import type { ContextLayer } from './layers/context/ContextLayer'
import type { FourwingsLayer } from './layers/fourwings/FourwingsLayer'
import type { VesselLayer } from './layers/vessel/VesselLayer'
import type { RulersLayer } from './layers/rulers/RulersLayer'
import { ClusterPickingObject, ClusterPickingInfo, ClusterLayer } from './layers/cluster'
import { ContextPickingObject, ContextPickingInfo } from './layers/context'
import { FourwingsPickingObject, FourwingsPickingInfo } from './layers/fourwings'
import { RulerPickingObject, RulerPickingInfo } from './layers/rulers'
import { VesselEventPickingObject, VesselEventPickingInfo } from './layers/vessel'
import { DrawLayer, DrawPickingInfo, DrawPickingObject } from './layers/draw'
import { UserLayerPickingObject } from './layers/user'

export type DeckLayerCategory = `${DataviewCategory}` | 'rulers' | 'draw'
export type DeckLayerSubcategory = `${DataviewType}` | 'draw-polygons' | 'draw-points'

// TODO:deck move this type to a generic like DeckLayerProps<SpecificLayerProps>
export type BaseLayerProps = {
  category: DeckLayerCategory
  subcategory?: DeckLayerSubcategory
}

// TODO:deck move this type to a generic like DeckPickingInfo<SpecificLayerInfo>
export type BasePickingObject = {
  id: string
  title?: string
  layerId: string
  category: DeckLayerCategory
  subcategory?: DeckLayerSubcategory
}

export type AnyDeckLayer<D extends {} = {}> =
  | Layer<D>
  | BaseMapLayer
  | ContextLayer
  | FourwingsLayer
  | VesselLayer
  | RulersLayer

export type LayerWithIndependentSublayersLoadState = VesselLayer

export type DeckLayerPickingObject =
  | FourwingsPickingObject
  | ContextPickingObject
  | UserLayerPickingObject
  | ClusterPickingObject
  | RulerPickingObject
  | VesselEventPickingObject
  | DrawPickingObject
  | PolygonPickingObject

export type DeckLayerInteractionPickingInfo =
  | (FourwingsPickingInfo & { layer: FourwingsLayer })
  | (ContextPickingInfo & { layer: ContextLayer })
  | (ClusterPickingInfo & { layer: ClusterLayer })
  | (RulerPickingInfo & { layer: RulersLayer })
  | (VesselEventPickingInfo & { layer: VesselLayer })
  | (DrawPickingInfo & { layer: DrawLayer })
